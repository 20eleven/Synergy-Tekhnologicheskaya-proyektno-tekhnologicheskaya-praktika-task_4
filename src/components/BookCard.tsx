import React, { FC } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Book, RentType } from '../types';

interface BookCardProps {
  book: Book;
  isFavorite?: boolean;
  onRent?: (bookId: string) => void;
  onPurchase?: (bookId: string) => void;
  onToggleFavorite?: (bookId: string) => void;
}

const DEFAULT_IMAGE_URL = 'https://img.freepik.com/free-photo/top-view-minimal-composition-with-books_23-2148851092.jpg';

const BookCard: FC<BookCardProps> = ({ 
  book, 
  isFavorite = false,
  onRent, 
  onPurchase,
  onToggleFavorite 
}) => {
  return (
    <Card className="h-100">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={book.imageUrl || DEFAULT_IMAGE_URL} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Button
          variant="link"
          className="position-absolute top-0 end-0 m-2 p-2"
          style={{ zIndex: 1 }}
          onClick={() => onToggleFavorite && onToggleFavorite(book.id)}
        >
          {isFavorite ? (
            <FaHeart color="red" size={24} />
          ) : (
            <FaRegHeart color="white" size={24} />
          )}
        </Button>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{book.title}</Card.Title>
        <Card.Text>
          <strong>Автор:</strong> {book.author}<br />
          <strong>Год:</strong> {book.publicationYear}<br />
          <strong>Категория:</strong> {book.category}<br />
          <strong>Цена:</strong> {book.price} руб.
        </Card.Text>
        <div className="mt-auto">
          <Badge bg={book.availability ? 'success' : 'danger'} className="me-2">
            {book.availability ? 'В наличии' : 'Нет в наличии'}
          </Badge>
          <Badge bg="info">
            {book.rentType === RentType.PURCHASE ? 'Покупка' : 'Аренда'}
          </Badge>
        </div>
        {book.availability && (
          <div className="mt-3">
            {book.rentType === RentType.PURCHASE ? (
              <Button 
                variant="primary" 
                className="w-100"
                onClick={() => onPurchase && onPurchase(book.id)}
              >
                Купить
              </Button>
            ) : (
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => onRent && onRent(book.id)}
              >
                Арендовать
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default BookCard;