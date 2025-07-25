import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Book } from './book.interface';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class BooksService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBooks(books: Book[]): Promise<Book[]> {
    const createdBooks = await Promise.all(
      books.map((book: Book) =>
        this.prisma.book.upsert({
          where: { title: book.title },
          update: {},
          create: {
            title: book.title,
            author: book.author,
            price: book.price,
            image: book.image,
          },
        }),
      ),
    );

    return createdBooks;
  }

  async getBooks(): Promise<any[]> {
    const url = 'https://books.toscrape.com/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const books: any[] = [];

    $('.product_pod').each((i, el) => {
      const title = $(el).find('h3 a').attr('title');
      const price = $(el).find('.price_color').text();
      const rating = $(el)
        .find('.star-rating')
        .attr('class')
        ?.replace('star-rating', '')
        .trim();
      const image = $(el).find('img').attr('src');

      books.push({
        title,
        price,
        rating,
        image: image
          ? `https://books.toscrape.com/${image.replace('../', '')}`
          : null,
      });
    });

    return books;
  }

  async saveFirst10Books(): Promise<Book[]> {
    const scrapedBooks = await this.getBooks();

    // Tomamos solo los primeros 10
    const booksToSave: Book[] = scrapedBooks
      .slice(0, 10)
      .map((book: any, index: number) => ({
        title: book.title,
        price: parseFloat(book.price.replace('£', '')),
        image: book.image,
        author: `Author ${index + 1}`,
      }));

    return this.createBooks(booksToSave);
  }

  async getBookById(id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  async getAllBooksFromDB(): Promise<Book[]> {
  return this.prisma.book.findMany();
}

}
