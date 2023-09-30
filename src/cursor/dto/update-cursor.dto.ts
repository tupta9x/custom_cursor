import { PartialType } from '@nestjs/mapped-types';
import { CreateCursorDto } from './create-cursor.dto';

export class UpdateCursorDto extends PartialType(CreateCursorDto) {}
