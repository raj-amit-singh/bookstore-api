import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';

export enum Category {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

@Schema({
  timestamps: true,
})
export class Book {

	@Prop({ index: true })
	title: string;

	@Prop({ index: true })
	author: string;

  @Prop()
  description: string;
  
  @Prop({  })
	imgURL: string;

  @Prop({type: Number})
  price: number;

  @Prop()
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}
export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.index({ title: 'text' });
