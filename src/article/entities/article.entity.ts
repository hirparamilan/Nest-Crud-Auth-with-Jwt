import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { v4 as uuid } from 'uuid';

export type ArticleDocument = Article & Document;

function customTimestamp(): number {
  return new Date().getTime();
}
@Schema()
export class Article {
  _id: mongoose.Types.ObjectId;

//   @Prop({ default: () => uuid() })
//   id: string;

  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop()
  author: string;

  @Prop({ default: customTimestamp })
  createdAt: number;

  @Prop({ default: customTimestamp })
  updatedAt: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);