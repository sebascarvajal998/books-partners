import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('scrape-books')
  async getBooks() {
    return await this.booksService.getBooks();
  }

  @Get('save')
  async saveBooks() {
    return this.booksService.saveFirst10Books();
  }

  @Get('allBooks')
  getAll() {
    return this.booksService.getAllBooksFromDB();
  }

  @Get(':id')
  getBookById(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.booksService.getBookById(numericId);
  }



}
