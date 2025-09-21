import React, { FC, useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import bookService from '../services/bookService';

interface BookFilterProps {
  onFilterChange: (filters: {
    sortBy: string;
    sortValue: string;
  }) => void;
}

const BookFilter: FC<BookFilterProps> = ({ onFilterChange }) => {
  const [sortBy, setSortBy] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      setLoading(true);
      const books = await bookService.getAllBooks();
      const uniqueCategories = [...new Set(books.map(book => book.category))];
      const uniqueAuthors = [...new Set(books.map(book => book.author))];
      const uniqueYears = [...new Set(books.map(book => book.publicationYear))].sort((a, b) => b - a);
      
      setCategories(uniqueCategories);
      setAuthors(uniqueAuthors);
      setYears(uniqueYears);
    } catch (error) {
      console.error('Ошибка загрузки опций фильтра:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setSortValue('');
    onFilterChange({ sortBy: value, sortValue: '' });
  };

  const handleSortValueChange = (value: string) => {
    setSortValue(value);
    onFilterChange({ sortBy, sortValue: value });
  };

  if (loading) {
    return (
      <div className="mb-4">
        <p>Загрузка фильтров...</p>
      </div>
    );
  }

  return (
    <Form className="mb-4">
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Сортировать по</Form.Label>
            <Form.Select 
              value={sortBy} 
              onChange={(e) => handleSortByChange(e.target.value)}
            >
              <option value="">Выберите критерий</option>
              <option value="category">Категории</option>
              <option value="author">Автора</option>
              <option value="year">Года написания</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        {sortBy === 'category' && (
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Выберите категорию</Form.Label>
              <Form.Select 
                value={sortValue} 
                onChange={(e) => handleSortValueChange(e.target.value)}
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        )}
        
        {sortBy === 'author' && (
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Выберите автора</Form.Label>
              <Form.Select 
                value={sortValue} 
                onChange={(e) => handleSortValueChange(e.target.value)}
              >
                <option value="">Все авторы</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        )}
        
        {sortBy === 'year' && (
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Выберите год</Form.Label>
              <Form.Select 
                value={sortValue} 
                onChange={(e) => handleSortValueChange(e.target.value)}
              >
                <option value="">Все годы</option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default BookFilter;