import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mi_clave_super_secreta',
    });
  }

  async validate(payload: any) {
    return {
      id_usuario: payload.sub,
      correo: payload.correo,
      nombre: payload.nombre,
      rol: payload.rol,
    };
  }
}