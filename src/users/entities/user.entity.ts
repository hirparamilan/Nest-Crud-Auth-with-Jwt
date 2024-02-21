import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { v4 as uuid } from 'uuid';

export type UserDocument = User & Document;

function customTimestamp(): number {
  return new Date().getTime();
}
@Schema()
export class User {
  _id: mongoose.Types.ObjectId;

//   @Prop({ default: () => uuid() })
//   id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  refresh_tokens: Array<string>;

  @Prop({ default: customTimestamp })
  createdAt: number;

  @Prop({ default: customTimestamp })
  updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);