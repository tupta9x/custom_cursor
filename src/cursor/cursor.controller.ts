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
import { CursorService } from './cursor.service';
import { CreateCursorDto } from './dto/create-cursor.dto';
import { UpdateCursorDto } from './dto/update-cursor.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PaginationQuery } from 'src/core/pagination/pagination';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cursor')
@ApiTags('Cursor')
export class CursorController {
  constructor(private readonly cursorService: CursorService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCursorDto: CreateCursorDto) {
    return this.cursorService.create(createCursorDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQuery, @Req() req: Request) {
    const originHost = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    return this.cursorService.findAll({
      ...paginationQuery,
      originHost,
    });
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursorService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursorDto: UpdateCursorDto) {
    return this.cursorService.update(id, updateCursorDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursorService.remove(id);
  }
}
