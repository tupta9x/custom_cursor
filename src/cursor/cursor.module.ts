import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursorService } from './cursor.service';
import { CursorController } from './cursor.controller';
import { Cursor, CursorSchema } from './schema/cursor.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cursor.name, schema: CursorSchema }])],
  controllers: [CursorController],
  providers: [CursorService]
})
export class CursorModule {}
