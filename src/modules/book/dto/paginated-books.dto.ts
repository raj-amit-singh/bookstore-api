import { IsNumber, IsObject } from 'class-validator';
import { Book } from '../schemas/book.schema';

export class PaginatedBooksDto {
	@IsNumber()
	count: number;

	@IsObject()
	books: Book[];
}
