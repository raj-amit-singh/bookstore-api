import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from './dto/pagination.dto';
import { PaginationQuery } from './dto/pagination-query';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}
  
  @Get()
  async getAllBooks(@Query() query: PaginationQuery): Promise<Book[]> {
    return this.bookService.findAll(query);
  }


	@Get('query')
	public async queryBooks(
		@Query() paginationQuery: PaginationQuery
	) {
		if (!paginationQuery.limit) {
			return await this.bookService.queryBooks(paginationQuery.query);
		}
		const safeLimit = parseInt(paginationQuery.limit.toString()) || 25;
		const safePage = parseInt(paginationQuery.page.toString()) || 1;
		const pagination: PaginationDto = {
			limit: safeLimit,
			page: safePage,
		};
		return await this.bookService.queryBooks(paginationQuery.query, pagination);
	}

  @Post()
  @UseGuards(AuthGuard())
  async createBook(
    @Body()
    book: CreateBookDto,
    @Req() req,
  ): Promise<Book> {
    return this.bookService.create(book, req.user);
  }

  @Get(':id')
  async getBook(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Put(':id')
  async updateBook(
    @Param('id')
    id: string,
    @Body()
    book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Delete(':id')
  async deleteBook(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.bookService.deleteById(id);
  }
}
