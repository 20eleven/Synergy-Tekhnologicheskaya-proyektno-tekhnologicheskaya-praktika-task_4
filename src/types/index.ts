export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publicationYear: number;
  price: number;
  availability: boolean;
  rentType: RentType;
  imageUrl?: string;
}

export enum RentType {
  PURCHASE = 'purchase',
  RENT = 'rent'
}

export interface RentalPeriod {
  id: string;
  name: string;
  duration: number; // in day
  multiplier: number; // price multiplier
}

export interface Rental {
  id: string;
  bookId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'returned';
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  daysBefore: number;
  emailTemplate: string;
}

export interface FavoriteBook {
  id: string;
  userId: string;
  bookId: string;
  addedAt: Date;
}