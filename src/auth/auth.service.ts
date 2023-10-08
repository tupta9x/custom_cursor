import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findByUsername(username);
    const passEncrypted = await comparePassword(pass, user?.password);

    if (!passEncrypted) {
      throw new BadRequestException();
    }
    const payload = { id: user._id, username: user.username, role: user.roles };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async registerUser(username: string, password: string): Promise<void> {
    // Encrypt the user's password
    const encryptedPassword = await hashPassword(password);

    // Create a new user in the database
    await this.usersService.create({ username, password: encryptedPassword });
  }
  
}