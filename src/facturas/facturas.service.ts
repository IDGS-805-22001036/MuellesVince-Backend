import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debes enviar un archivo PDF');
    }

    const factura = this.facturaRepository.create({
      tipo: createFacturaDto.tipo,
      nombre_pdf: file.originalname,
      mime_type: file.mimetype,
      pdf_data: file.buffer,
    });

    return await this.facturaRepository.save(factura);
  }

  async findAll() {
    const facturas = await this.facturaRepository.find({
      order: { id_factura: 'DESC' },
    });

    return facturas.map((factura) => ({
      id_factura: factura.id_factura,
      tipo: factura.tipo,
      nombre_pdf: factura.nombre_pdf,
      mime_type: factura.mime_type,
      fecha: factura.fecha,
    }));
  }

  async findOne(id: number) {
    const factura = await this.facturaRepository.findOne({
      where: { id_factura: id },
    });

    if (!factura) {
      throw new NotFoundException(`No se encontró la factura con id ${id}`);
    }

    return factura;
  }

  async update(
    id: number,
    updateFacturaDto: UpdateFacturaDto,
    file?: Express.Multer.File,
  ) {
    const factura = await this.findOne(id);

    if (updateFacturaDto.tipo) {
      factura.tipo = updateFacturaDto.tipo;
    }

    if (file) {
      factura.nombre_pdf = file.originalname;
      factura.mime_type = file.mimetype;
      factura.pdf_data = file.buffer;
    }

    await this.facturaRepository.save(factura);

    return {
      message: `Factura con id ${id} actualizada correctamente`,
    };
  }

  async remove(id: number) {
    const factura = await this.findOne(id);

    await this.facturaRepository.remove(factura);

    return {
      message: `Factura con id ${id} eliminada correctamente`,
    };
  }

  async obtenerPdf(id: number) {
    const factura = await this.findOne(id);

    if (!factura.pdf_data) {
      throw new NotFoundException('La factura no tiene PDF registrado');
    }

    return {
      nombre_pdf: factura.nombre_pdf,
      mime_type: factura.mime_type || 'application/pdf',
      pdf_data: factura.pdf_data,
    };
  }
}