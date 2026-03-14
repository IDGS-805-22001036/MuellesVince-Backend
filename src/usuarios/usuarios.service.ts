import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findByCorreo(correo: string) {
    return await this.usuarioRepository.findOne({
      where: { correo },
    });
  }

  async createAdminInicial() {
    const existe = await this.findByCorreo('eliazmarias13@gmail.com');

    if (existe) {
      return { message: 'El usuario admin ya existe' };
    }

    const passwordHash = await bcrypt.hash('Elias.2021', 10);

    const usuario = this.usuarioRepository.create({
      nombre: 'Maria Cruz Elias',
      correo: 'eliazmarias13@gmail.com',
      password: passwordHash,
      rol: 'ADMIN',
      activo: true,
    });

    await this.usuarioRepository.save(usuario);

    return {
      message: 'Usuario creado correctamente',
    correo: 'eliazmarias13@gmail.com',
    password: 'Elias.2021',
    };
  }
}