import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import BookCard from '../components/BookCard';
import bookService from '../services/bookService';
import favoriteService from '../services/favoriteService';
import BookFilter from '../components/BookFilter';
import { Book } from '../types';

const FavoritesPage: React.FC = () => {
  const [userId] = useState('user1');
  const [allFavoriteBooks, setAllFavoriteBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [favoriteBookIds, setFavoriteBookIds] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavoriteBooks();
  }, []);

  const loadFavoriteBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Загружаем избранные книги и все книги параллельно
      const [favoriteIds, allBooks] = await Promise.all([
        favoriteService.getFavoriteBookIds(userId),
        bookService.getAllBooks()
      ]);
      
      // Фильтруем книги, которые находятся в избранном
      const favorites = allBooks.filter(book => favoriteIds.includes(book.id));
      
      setAllFavoriteBooks(favorites);
      setFilteredBooks(favorites);
      setFavoriteBookIds(favoriteIds);
    } catch (err) {
      setError('Ошибка загрузки избранных книг');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (bookId: string) => {
    try {
      const isCurrentlyFavorite = favoriteBookIds.includes(bookId);
      
      if (isCurrentlyFavorite) {
        await favoriteService.removeFavorite(userId, bookId);
      } else {
        await favoriteService.addFavorite(userId, bookId);
      }
      
      await loadFavoriteBooks();
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка при обновлении избранного');
    }
  };

  const handleFilterChange = (filters: { sortBy: string; sortValue: string }) => {
    let result = [...allFavoriteBooks];
    
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Загрузка избранных книг...</span>
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
      <h1 className="mb-4">Ваши любимые книги</h1>
      
      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          Операция успешно выполнена!
        </Alert>
      )}
      
      <BookFilter onFilterChange={handleFilterChange} />
      
      {filteredBooks.length === 0 ? (
        <Alert variant="info">
          {allFavoriteBooks.length === 0 
            ? 'У вас пока нет любимых книг. Перейдите в каталог и добавьте книги в избранное!'
            : 'По вашему запросу книги не найдены.'}
        </Alert>
      ) : (
        <Row>
          {filteredBooks.map(book => (
            <Col key={book.id} md={4} className="mb-4">
              <BookCard 
                book={book}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default FavoritesPage;