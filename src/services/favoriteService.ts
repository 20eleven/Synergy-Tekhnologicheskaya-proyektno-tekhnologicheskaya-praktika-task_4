import { FavoriteBook } from '../types';
import * as api from './api';

class FavoriteService {
  async addFavorite(userId: string, bookId: string): Promise<FavoriteBook> {
    return await api.addFavorite(userId, bookId);
  }

  async removeFavorite(userId: string, bookId: string): Promise<boolean> {
    return await api.removeFavorite(userId, bookId);
  }

  async getFavorites(userId: string): Promise<FavoriteBook[]> {
    return await api.getFavorites(userId);
  }

  async isFavorite(userId: string, bookId: string): Promise<boolean> {
    return await api.isFavorite(userId, bookId);
  }

  async getFavoriteBookIds(userId: string): Promise<string[]> {
    return await api.getFavoriteBookIds(userId);
  }
}

const favoriteService = new FavoriteService();
export default favoriteService;