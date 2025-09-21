import { Book, RentType, Rental, RentalPeriod, ReminderSettings, FavoriteBook } from '../types';

const mockBooks: Book[] = [
  {
    id: '1',
    title: '1984',
    author: 'Джордж Оруэлл',
    category: 'Антиутопия',
    publicationYear: 1949,
    price: 450,
    availability: true,
    rentType: RentType.PURCHASE,
    imageUrl: ''
  },
  {
    id: '2',
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    category: 'Роман',
    publicationYear: 1967,
    price: 520,
    availability: true,
    rentType: RentType.RENT,
    imageUrl: ''
  },
  {
    id: '3',
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    category: 'Классика',
    publicationYear: 1866,
    price: 380,
    availability: false,
    rentType: RentType.PURCHASE,
    imageUrl: ''
  },
  {
    id: '4',
    title: 'Гарри Поттер и философский камень',
    author: 'Дж. К. Роулинг',
    category: 'Фэнтези',
    publicationYear: 1997,
    price: 420,
    availability: true,
    rentType: RentType.RENT,
    imageUrl: ''
  },
  {
    id: '5',
    title: 'Война и мир',
    author: 'Лев Толстой',
    category: 'Классика',
    publicationYear: 1869,
    price: 650,
    availability: true,
    rentType: RentType.PURCHASE,
    imageUrl: ''
  }
];

const mockRentalPeriods: RentalPeriod[] = [
  { id: '1', name: '2 недели', duration: 14, multiplier: 0.3 },
  { id: '2', name: '1 месяц', duration: 30, multiplier: 0.5 },
  { id: '3', name: '3 месяца', duration: 90, multiplier: 1.2 }
];

let mockReminders: ReminderSettings = {
  enabled: true,
  daysBefore: 3,
  emailTemplate: 'Уважаемый читатель, срок аренды книги истекает через 5 дней.'
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// books api
export const getAllBooks = async (): Promise<Book[]> => {
  await delay(500);
  return [...mockBooks];
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
  await delay(300);
  return mockBooks.find(book => book.id === id);
};

export const addBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  await delay(300);
  const newBook: Book = {
    ...book,
    id: Date.now().toString()
  };
  mockBooks.push(newBook);
  return newBook;
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book | null> => {
  await delay(300);
  const index = mockBooks.findIndex(b => b.id === id);
  if (index !== -1) {
    mockBooks[index] = { ...mockBooks[index], ...book };
    return mockBooks[index];
  }
  return null;
};

export const deleteBook = async (id: string): Promise<boolean> => {
  await delay(300);
  const index = mockBooks.findIndex(b => b.id === id);
  if (index !== -1) {
    mockBooks.splice(index, 1);
    return true;
  }
  return false;
};

export const getCategories = async (): Promise<string[]> => {
  await delay(200);
  return [...new Set(mockBooks.map(book => book.category))];
};

export const getAuthors = async (): Promise<string[]> => {
  await delay(200);
  return [...new Set(mockBooks.map(book => book.author))];
};

// rent api
export const getRentalPeriods = async (): Promise<RentalPeriod[]> => {
  await delay(200);
  return [...mockRentalPeriods];
};

export const rentBook = async (bookId: string, userId: string, periodId: string): Promise<Rental | null> => {
  await delay(300);
  const period = mockRentalPeriods.find(p => p.id === periodId);
  if (!period) return null;

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + period.duration);

  const rental: Rental = {
    id: Date.now().toString(),
    bookId,
    userId,
    startDate,
    endDate,
    status: 'active'
  };

  return rental;
};

// reminder api
export const getReminderSettings = async (): Promise<ReminderSettings> => {
  await delay(200);
  return { ...mockReminders };
};

export const updateReminderSettings = async (settings: Partial<ReminderSettings>): Promise<void> => {
  await delay(300);
  mockReminders = { ...mockReminders, ...settings };
};

// favorites books apii
const mockFavorites: FavoriteBook[] = [];

export const addFavorite = async (userId: string, bookId: string): Promise<FavoriteBook> => {
  await delay(300);
  
  const existing = mockFavorites.find(fav => 
    fav.userId === userId && fav.bookId === bookId
  );
  
  if (existing) {
    return existing;
  }

  const favorite: FavoriteBook = {
    id: Date.now().toString(),
    userId,
    bookId,
    addedAt: new Date()
  };

  mockFavorites.push(favorite);
  return favorite;
};

export const removeFavorite = async (userId: string, bookId: string): Promise<boolean> => {
  await delay(300);
  const initialLength = mockFavorites.length;
  const filtered = mockFavorites.filter(fav => 
    !(fav.userId === userId && fav.bookId === bookId)
  );
  
  if (filtered.length < initialLength) {
    mockFavorites.length = 0;
    mockFavorites.push(...filtered);
    return true;
  }
  return false;
};

export const getFavorites = async (userId: string): Promise<FavoriteBook[]> => {
  await delay(300);
  return mockFavorites.filter(fav => fav.userId === userId);
};

export const isFavorite = async (userId: string, bookId: string): Promise<boolean> => {
  await delay(200);
  return mockFavorites.some(fav => 
    fav.userId === userId && fav.bookId === bookId
  );
};

export const getFavoriteBookIds = async (userId: string): Promise<string[]> => {
  await delay(300);
  return mockFavorites
    .filter(fav => fav.userId === userId)
    .map(fav => fav.bookId);
};