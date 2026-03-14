import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import { Cotizacione } from './entities/cotizacione.entity';
import { CotizacionDetalle } from './entities/cotizacion-detalle.entity';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacione)
    private readonly cotizacionRepository: Repository<Cotizacione>,
    @InjectRepository(CotizacionDetalle)
    private readonly detalleRepository: Repository<CotizacionDetalle>,
  ) {}

  private redondear(valor: number) {
    return Number(valor.toFixed(2));
  }

  private generarFolio(id: number) {
    return `COT-${String(id).padStart(5, '0')}`;
  }

  private calcularTotales(
    detalles: { cantidad: number; precio_unitario: number }[],
    ivaPorcentaje: number,
  ) {
    const subtotal = this.redondear(
      detalles.reduce(
        (acc, item) => acc + Number(item.cantidad) * Number(item.precio_unitario),
        0,
      ),
    );

    const iva = this.redondear(subtotal * (Number(ivaPorcentaje) / 100));
    const total = this.redondear(subtotal + iva);

    return { subtotal, iva, total };
  }

  async create(createCotizacioneDto: CreateCotizacioneDto) {
    const fecha =
      createCotizacioneDto.fecha ||
      new Date().toISOString().split('T')[0];

    const { subtotal, iva, total } = this.calcularTotales(
      createCotizacioneDto.detalles,
      createCotizacioneDto.ivaPorcentaje,
    );

    const cotizacion = this.cotizacionRepository.create({
      nombre_cliente: createCotizacioneDto.nombre_cliente,
      telefono: createCotizacioneDto.telefono,
      correo: createCotizacioneDto.correo,
      direccion: createCotizacioneDto.direccion,
      rfc: createCotizacioneDto.rfc,
      fecha,
      notas: createCotizacioneDto.notas,
      subtotal,
      iva,
      total,
      folio: 'TEMP',
      detalles: createCotizacioneDto.detalles.map((item) =>
        this.detalleRepository.create({
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          importe: this.redondear(
            Number(item.cantidad) * Number(item.precio_unitario),
          ),
        }),
      ),
    });

    const guardada = await this.cotizacionRepository.save(cotizacion);
    guardada.folio = this.generarFolio(guardada.id_cotizacion);

    return await this.cotizacionRepository.save(guardada);
  }

  async findAll() {
    return await this.cotizacionRepository.find({
      order: { id_cotizacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { id_cotizacion: id },
    });

    if (!cotizacion) {
      throw new NotFoundException(`No se encontró la cotización con id ${id}`);
    }

    return cotizacion;
  }

  async update(id: number, updateCotizacioneDto: UpdateCotizacioneDto) {
    const existente = await this.findOne(id);

    const detallesBase =
      updateCotizacioneDto.detalles?.length
        ? updateCotizacioneDto.detalles
        : existente.detalles.map((d) => ({
            descripcion: d.descripcion,
            cantidad: Number(d.cantidad),
            precio_unitario: Number(d.precio_unitario),
          }));

    const ivaPorcentaje =
      updateCotizacioneDto.ivaPorcentaje ??
      (existente.subtotal > 0
        ? (Number(existente.iva) / Number(existente.subtotal)) * 100
        : 0);

    const { subtotal, iva, total } = this.calcularTotales(
      detallesBase,
      ivaPorcentaje,
    );

    existente.nombre_cliente =
      updateCotizacioneDto.nombre_cliente ?? existente.nombre_cliente;
    existente.telefono =
      updateCotizacioneDto.telefono ?? existente.telefono;
    existente.correo =
      updateCotizacioneDto.correo ?? existente.correo;
    existente.direccion =
      updateCotizacioneDto.direccion ?? existente.direccion;
    existente.rfc = updateCotizacioneDto.rfc ?? existente.rfc;
    existente.fecha = updateCotizacioneDto.fecha ?? existente.fecha;
    existente.notas = updateCotizacioneDto.notas ?? existente.notas;
    existente.subtotal = subtotal;
    existente.iva = iva;
    existente.total = total;

    if (updateCotizacioneDto.detalles) {
      await this.detalleRepository.delete({
        cotizacion: { id_cotizacion: id } as Cotizacione,
      });

      existente.detalles = updateCotizacioneDto.detalles.map((item) =>
        this.detalleRepository.create({
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          importe: this.redondear(
            Number(item.cantidad) * Number(item.precio_unitario),
          ),
        }),
      );
    }

    return await this.cotizacionRepository.save(existente);
  }

  async remove(id: number) {
    const cotizacion = await this.findOne(id);
    await this.cotizacionRepository.remove(cotizacion);

    return {
      message: `Cotización con id ${id} eliminada correctamente`,
    };
  }

  async generarPdf(id: number): Promise<PDFKit.PDFDocument> {
    const cotizacion = await this.findOne(id);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
    });

    const colorPrimario = '#0a1628';
    const colorSecundario = '#1e64d2';
    const colorTexto = '#1f2937';
    const gris = '#6b7280';
    const grisClaro = '#e5e7eb';

    doc.rect(0, 0, 595, 120).fill(colorPrimario);

    const logoPath = path.join(
      process.cwd(),
      'src',
      'img',
      'LogoTaller-removebg-preview.png',
    );

    try {
     doc.image(logoPath, 40, 22, {
  fit: [72, 72],
});
    } catch (error) {
      console.log('No se pudo cargar el logo:', error);
    }

    doc
      .fillColor('#ffffff')
      .fontSize(26)
      .text('Muelles Vince', 125, 34, { align: 'left' });

    doc
      .fillColor('#dbeafe')
      .fontSize(12)
      .text('Cotización', 127, 68, { align: 'left' });

    doc
      .fillColor('#ffffff')
      .fontSize(11)
      .text(`Folio: ${cotizacion.folio}`, 400, 38, { align: 'right' })
      .text(`Fecha: ${cotizacion.fecha}`, 400, 56, { align: 'right' });

    let y = 145;

    doc
      .fillColor(colorSecundario)
      .fontSize(13)
      .text('Datos del cliente', 40, y);

    y += 24;

    doc
      .fillColor(colorTexto)
      .fontSize(10)
      .text(`Nombre: ${cotizacion.nombre_cliente || '-'}`, 40, y)
      .text(`Teléfono: ${cotizacion.telefono || '-'}`, 300, y);

    y += 18;

    doc
      .text(`Correo: ${cotizacion.correo || '-'}`, 40, y)
      .text(`RFC: ${cotizacion.rfc || '-'}`, 300, y);

    y += 18;

    doc.text(`Dirección: ${cotizacion.direccion || '-'}`, 40, y, {
      width: 500,
    });

    y += 34;

    doc
      .fillColor(colorSecundario)
      .fontSize(13)
      .text('Conceptos', 40, y);

    y += 22;

    doc
      .fillColor('#ffffff')
      .rect(40, y, 515, 24)
      .fill(colorSecundario);

    doc
      .fillColor('#ffffff')
      .fontSize(10)
      .text('Descripción', 48, y + 7)
      .text('Cant.', 330, y + 7, { width: 50, align: 'center' })
      .text('P. Unit.', 390, y + 7, { width: 70, align: 'right' })
      .text('Importe', 470, y + 7, { width: 75, align: 'right' });

    y += 24;

    cotizacion.detalles.forEach((item, index) => {
      const rowHeight = 24;

      if (index % 2 === 0) {
        doc.rect(40, y, 515, rowHeight).fill('#f8fafc');
      }

      doc
        .fillColor(colorTexto)
        .fontSize(10)
        .text(item.descripcion, 48, y + 7, { width: 260 })
        .text(Number(item.cantidad).toFixed(2), 330, y + 7, {
          width: 50,
          align: 'center',
        })
        .text(`$${Number(item.precio_unitario).toFixed(2)}`, 390, y + 7, {
          width: 70,
          align: 'right',
        })
        .text(`$${Number(item.importe).toFixed(2)}`, 470, y + 7, {
          width: 75,
          align: 'right',
        });

      y += rowHeight;

      doc.strokeColor(grisClaro).moveTo(40, y).lineTo(555, y).stroke();
    });

    y += 20;

    const boxX = 355;
    const boxY = y;
    const boxW = 200;
    const lineH = 22;

    doc.roundedRect(boxX, boxY, boxW, 78, 8).strokeColor(grisClaro).stroke();

    doc
      .fillColor(gris)
      .fontSize(10)
      .text('Subtotal', boxX + 12, boxY + 10)
      .text('IVA', boxX + 12, boxY + 10 + lineH)
      .fontSize(12)
      .fillColor(colorPrimario)
      .text('Total', boxX + 12, boxY + 10 + lineH * 2);

    doc
      .fillColor(colorTexto)
      .fontSize(10)
      .text(`$${Number(cotizacion.subtotal).toFixed(2)}`, boxX + 100, boxY + 10, {
        width: 85,
        align: 'right',
      })
      .text(`$${Number(cotizacion.iva).toFixed(2)}`, boxX + 100, boxY + 10 + lineH, {
        width: 85,
        align: 'right',
      })
      .fontSize(12)
      .fillColor(colorPrimario)
      .text(`$${Number(cotizacion.total).toFixed(2)}`, boxX + 100, boxY + 10 + lineH * 2, {
        width: 85,
        align: 'right',
      });

    y += 110;

    doc
      .fillColor(colorSecundario)
      .fontSize(13)
      .text('Notas', 40, y);

    y += 20;

    doc
      .fillColor(colorTexto)
      .fontSize(10)
      .text(cotizacion.notas || 'Sin notas adicionales.', 40, y, {
        width: 515,
        align: 'justify',
      });

    doc
      .fillColor(gris)
      .fontSize(9)
      .text(
        '',
        40,
        760,
        { align: 'center', width: 515 },
      );

    doc.end();
    return doc;
  }
}