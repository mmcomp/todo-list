import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (conf: ConfigService) => {
        return {
          global: true,
          secret: await conf.get('JWT_SECRET'),
          signOptions: { expiresIn: `${await conf.get('JWT_LIFE_SECONDS')}s` },
        };
      },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
