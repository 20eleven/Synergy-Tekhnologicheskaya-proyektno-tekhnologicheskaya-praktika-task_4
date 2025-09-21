import React, { FC, useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Book, RentalPeriod } from '../types';
import rentalService from '../services/rentalService';

interface RentModalProps {
  show: boolean;
  onHide: () => void;
  book?: Book;
  onRent: (bookId: string, periodId: string) => void;
}

const RentModal: FC<RentModalProps> = ({ show, onHide, book, onRent }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [rentalPeriods, setRentalPeriods] = useState<RentalPeriod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      loadRentalPeriods();
    }
  }, [show]);

  const loadRentalPeriods = async () => {
    try {
      setLoading(true);
      const periods = await rentalService.getRentalPeriods();
      setRentalPeriods(periods);
    } catch (error) {
      console.error('Ошибка загрузки периодов аренды:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRent = () => {
    if (book && selectedPeriod) {
      onRent(book.id, selectedPeriod);
      onHide();
    }
  };

  if (!book) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Аренда книги: {book.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Загрузка периодов аренды...</p>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Выберите срок аренды</Form.Label>
              <Form.Select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="">Выберите...</option>
                {rentalPeriods.map((period: RentalPeriod) => (
                  <option key={period.id} value={period.id}>
                    {period.name} ({(book.price * period.multiplier).toFixed(2)} руб.)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button 
          variant="primary" 
          onClick={handleRent}
          disabled={!selectedPeriod || loading}
        >
          Арендовать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RentModal;