import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { decryptPassword, encryptPassword } from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findByUsername(username);
    const passEncrypted = await decryptPassword(pass);

    if (user?.password !== passEncrypted) {
      throw new BadRequestException();
    }
    const payload = { id: user._id, username: user.username, role: user.roles };
    console.log(`PAYLOAD:::::`, payload)
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async registerUser(username: string, password: string): Promise<void> {
    // Encrypt the user's password
    const encryptedPassword = await encryptPassword(password);

    // Create a new user in the database
    await this.usersService.create({ username, password: encryptedPassword });
  }
  
}