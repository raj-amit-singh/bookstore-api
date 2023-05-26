import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';

import { User } from '../user/schemas/user.schema';
import { PaginatedBooksDto } from './dto/paginated-books.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginationQuery } from './dto/pagination-query';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: PaginationQuery): Promise<Book[]> {

    const safeLimit = parseInt(query.limit.toString()) || 25;
		const safePage = parseInt(query.page.toString()) || 1;
    const skip = safePage * (query.page - 1);

    const keyword = query.query
      ? {
          title: {
            $regex: query.query,
            $options: 'i',
          },
        }
      : {};

    const books = await this.bookModel
      .find({ ...keyword })
      .limit(safeLimit)
      .skip(skip);
    return books;
  }

  // get books/query/:key
	public async queryBooks(
		q: string,
		pagination?: PaginationDto,
	): Promise<PaginatedBooksDto> {
		const count = await this.bookModel.countDocuments({
			$text: { $search: `\"${q}\"` },
		});
		const limit = pagination?.limit || 25;
		const page = pagination?.page || 1;

		const books: Book[] = await this.bookModel
			.find({ $text: { $search: `\"${q}\"` } })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		return { count, books };
	}

  	// get books/genre/:genre
	public async findManyByGenre(
		genre: string,
		pagination?: PaginationDto,
	): Promise<PaginatedBooksDto> {
		const count = await this.bookModel.countDocuments({ genre });
		let books: Book[];
		if (!pagination) {
			books = await this.bookModel.find({}).lean();
		} else {
			const { limit, page } = pagination;
			books = await this.bookModel
				.find({ genre: genre })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean();
		}
		return { count, books };
	}
  
  async create(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, { user: user._id });

    const res = await this.bookModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const book:Book = await this.bookModel.findById(id).lean();

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  // get books/search/:key

	public async searchBooks(q: string): Promise<Book[]> {
		const books: Book[] = await this.bookModel
			.find({ $text: { $search: `\"${q}\"` } })
			.limit(10)
			.lean();
		return books;
	}

  async updateById(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
