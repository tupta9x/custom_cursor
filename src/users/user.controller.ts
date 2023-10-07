import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/core/pagination/pagination';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('user')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  
  @Post()
  // @Roles(Role.Admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQuery, @Req() req: Request) {
    const originHost = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    return this.userService.findAll({
      ...paginationQuery,
      originHost,});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Patch(':id')
  // @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
