import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from '../book/book.service';
import { Book, BookSchema } from '../book/schemas/book.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

@Module({
  imports:[
    MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Book.name, schema: BookSchema },
		]),
  ],
  providers: [UserService, BookService],
	exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
