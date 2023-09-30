import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CursorService } from './cursor.service';
import { CreateCursorDto } from './dto/create-cursor.dto';
import { UpdateCursorDto } from './dto/update-cursor.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('cursor')
@ApiTags('Cursor')
export class CursorController {
  constructor(private readonly cursorService: CursorService) {}

  @Post()
  create(@Body() createCursorDto: CreateCursorDto) {
    return this.cursorService.create(createCursorDto);
  }

  @Get()
  findAll() {
    return this.cursorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursorDto: UpdateCursorDto) {
    return this.cursorService.update(id, updateCursorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursorService.remove(id);
  }
}
