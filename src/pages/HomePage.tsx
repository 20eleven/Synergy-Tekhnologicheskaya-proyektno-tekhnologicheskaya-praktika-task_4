import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import BookCard from '../components/BookCard';
import BookFilter from '../components/BookFilter';
import RentModal from '../components/RentModal';
import bookService from '../services/bookService';
import rentalService from '../services/rentalService';
import favoriteService from '../services/favoriteService';
import { Book } from '../types';

const HomePage: React.FC = () => {
  const [userId] = useState('user1');
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState<string[]>([]);
  const [showRentModal, setShowRentModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [books, favorites] = await Promise.all([
        bookService.getAllBooks(),
        favoriteService.getFavoriteBookIds(userId)
      ]);
      setAllBooks(books);
      setFilteredBooks(books);
      setFavoriteBookIds(favorites);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: { sortBy: string; sortValue: string }) => {
    let result = [...allBooks];
    
    if (filters.sortBy && filters.sortValue) {
      switch (filters.sortBy) {
        case 'category':
          result = result.filter(book => book.category === filters.sortValue);
          break;
        case 'author':
          result = result.filter(book => book.author === filters.sortValue);
          break;
        case 'year':
          result = result.filter(book => book.publicationYear === parseInt(filters.sortValue));
          break;
      }
    }
    
    setFilteredBooks(result);
  };

  const handleToggleFavorite = async (bookId: string) => {
    try {
      if (favoriteBookIds.includes(bookId)) {
        await favoriteService.removeFavorite(userId, bookId);
      } else {
        await favoriteService.addFavorite(userId, bookId);
      }
      
      const updatedFavorites = await favoriteService.getFavoriteBookIds(userId);
      setFavoriteBookIds(updatedFavorites);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка при обновлении избранного');
    }
  };

  const handleRentClick = (bookId: string) => {
    const book = allBooks.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setShowRentModal(true);
    }
  };

  const handlePurchaseClick = (bookId: string) => {
    alert('Функционал временно не работает');
  };

  const handleRent = async (bookId: string, periodId: string) => {
    try {
      await rentalService.rentBook(bookId, userId, periodId);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка при аренде книги');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Загрузка данных...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Каталог книг</h1>
      
      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          Операция успешно выполнена!
        </Alert>
      )}
      
      <BookFilter onFilterChange={handleFilterChange} />
      
      {filteredBooks.length === 0 ? (
        <Alert variant="info">
          По вашему запросу книги не найдены.
        </Alert>
      ) : (
        <Row>
          {filteredBooks.map(book => (
            <Col key={book.id} md={4} className="mb-4">
              <BookCard 
                book={book}
                isFavorite={favoriteBookIds.includes(book.id)}
                onRent={handleRentClick}
                onPurchase={handlePurchaseClick}
                onToggleFavorite={handleToggleFavorite}
              />
            </Col>
          ))}
        </Row>
      )}
      
      <RentModal 
        show={showRentModal}
        onHide={() => setShowRentModal(false)}
        book={selectedBook}
        onRent={handleRent}
      />
    </Container>
  );
};

export default HomePage;