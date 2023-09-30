import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findByUsername(username);
    console.log(pass)
    if (user?.password !== pass) {
      throw new BadRequestException();
    }
    const payload = { id: user._id, username: user.username, role: user.roles };
    console.log(`PAYLOAD:::::`, payload)
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}