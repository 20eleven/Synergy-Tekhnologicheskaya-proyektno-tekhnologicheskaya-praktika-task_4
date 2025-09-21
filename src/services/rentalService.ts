import { Rental, RentalPeriod } from '../types';
import * as api from './api';

class RentalService {
  async getRentalPeriods(): Promise<RentalPeriod[]> {
    return await api.getRentalPeriods();
  }

  async rentBook(bookId: string, userId: string, periodId: string): Promise<Rental | null> {
    return await api.rentBook(bookId, userId, periodId);
  }
}

const rentalService = new RentalService();
export default rentalService;