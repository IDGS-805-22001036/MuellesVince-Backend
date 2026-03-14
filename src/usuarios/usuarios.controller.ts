import { Controller, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('crear-admin')
  crearAdmin() {
    return this.usuariosService.createAdminInicial();
  }
}