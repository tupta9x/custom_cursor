import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  timestamps: true,
})
export class Cursor extends Document {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  cursor: string;

  @Prop()
  pointer: string;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'Category' })
  category: Category;
}
export const CursorSchema = SchemaFactory.createForClass(Cursor);
