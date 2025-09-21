import { Book } from '../types';
import * as api from './api';

class BookService {
  async getAllBooks(): Promise<Book[]> {
    return await api.getAllBooks();
  }

  async getBookById(id: string): Promise<Book | undefined> {
    return await api.getBookById(id);
  }

  async addBook(book: Omit<Book, 'id'>): Promise<Book> {
    return await api.addBook(book);
  }

  async updateBook(id: string, book: Partial<Book>): Promise<Book | null> {
    return await api.updateBook(id, book);
  }

  async deleteBook(id: string): Promise<boolean> {
    return await api.deleteBook(id);
  }

  async getCategories(): Promise<string[]> {
    return await api.getCategories();
  }

  async getAuthors(): Promise<string[]> {
    return await api.getAuthors();
  }
}

const bookService = new BookService();
export default bookService;