import React, { FC, useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Table, 
  Modal, 
  Form, 
  Alert,
  Badge,
  Spinner
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaBell } from 'react-icons/fa';
import bookService from '../services/bookService';
import reminderService from '../services/reminderService';
import { Book, RentType, ReminderSettings } from '../types';

const AdminPage: FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: false,
    daysBefore: 3,
    emailTemplate: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [booksData, settings] = await Promise.all([
        bookService.getAllBooks(),
        reminderService.getSettings()
      ]);
      setBooks(booksData);
      setReminderSettings(settings);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      try {
        const success = await bookService.deleteBook(id);
        if (success) {
          await loadAllData();
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }
      } catch (err) {
        setError('Ошибка при удалении книги');
      }
    }
  };

  const handleSaveBook = async (bookData: Omit<Book, 'id'>) => {
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, bookData);
      } else {
        await bookService.addBook(bookData);
      }
      await loadAllData();
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка при сохранении книги');
    }
  };

  const handleReminderSettingsSave = async () => {
    try {
      await reminderService.updateSettings(reminderSettings);
      setShowReminderModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка при сохранении настроек');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Административная панель</h1>
        <div>
          <Button 
            variant="warning" 
            className="me-2"
            onClick={() => setShowReminderModal(true)}
          >
            <FaBell className="me-1" /> Настройки напоминаний
          </Button>
          <Button variant="primary" onClick={handleAddBook}>
            <FaPlus className="me-1" /> Добавить книгу
          </Button>
        </div>
      </div>

      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          Операция успешно выполнена!
        </Alert>
      )}

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Название</th>
                <th>Автор</th>
                <th>Категория</th>
                <th>Год</th>
                <th>Цена</th>
                <th>Доступность</th>
                <th>Тип</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.price} руб.</td>
                  <td>
                    <Badge bg={book.availability ? 'success' : 'danger'}>
                      {book.availability ? 'В наличии' : 'Нет'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={book.rentType === RentType.PURCHASE ? 'primary' : 'info'}>
                      {book.rentType === RentType.PURCHASE ? 'Покупка' : 'Аренда'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditBook(book)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <BookModal 
        show={showModal}
        onHide={() => setShowModal(false)}
        book={editingBook}
        onSave={handleSaveBook}
      />

      <ReminderSettingsModal
        show={showReminderModal}
        onHide={() => setShowReminderModal(false)}
        settings={reminderSettings}
        onSettingsChange={setReminderSettings}
        onSave={handleReminderSettingsSave}
      />
    </Container>
  );
};

interface BookModalProps {
  show: boolean;
  onHide: () => void;
  book: Book | null;
  onSave: (book: Omit<Book, 'id'>) => void;
}

const BookModal: React.FC<BookModalProps> = ({ show, onHide, book, onSave }) => {
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    category: '',
    publicationYear: new Date().getFullYear(),
    price: 0,
    availability: true,
    rentType: RentType.PURCHASE,
    imageUrl: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        publicationYear: book.publicationYear,
        price: book.price,
        availability: book.availability,
        rentType: book.rentType,
        imageUrl: book.imageUrl || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: '',
        publicationYear: new Date().getFullYear(),
        price: 0,
        availability: true,
        rentType: RentType.PURCHASE,
        imageUrl: ''
      });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {book ? 'Редактировать книгу' : 'Добавить книгу'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Название</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Автор</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Категория</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Год издания</Form.Label>
                <Form.Control
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  min="1000"
                  max={new Date().getFullYear()}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Цена (руб.)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Тип</Form.Label>
                <Form.Select
                  name="rentType"
                  value={formData.rentType}
                  onChange={handleChange}
                >
                  <option value={RentType.PURCHASE}>Покупка</option>
                  <option value={RentType.RENT}>Аренда</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>URL изображения</Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="availability"
              label="В наличии"
              checked={formData.availability}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Отмена
          </Button>
          <Button variant="primary" type="submit">
            Сохранить
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

interface ReminderSettingsModalProps {
  show: boolean;
  onHide: () => void;
  settings: ReminderSettings;
  onSettingsChange: (settings: ReminderSettings) => void;
  onSave: () => void;
}

const ReminderSettingsModal: React.FC<ReminderSettingsModalProps> = ({ 
  show, 
  onHide, 
  settings, 
  onSettingsChange,
  onSave 
}) => {
  const handleChange = (field: keyof ReminderSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Настройки напоминаний</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Включить напоминания"
              checked={settings.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>За сколько дней отправлять напоминание</Form.Label>
            <Form.Control
              type="number"
              value={settings.daysBefore}
              onChange={(e) => handleChange('daysBefore', parseInt(e.target.value) || 3)}
              min="1"
              max="30"
              disabled={!settings.enabled}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Шаблон email</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={settings.emailTemplate}
              onChange={(e) => handleChange('emailTemplate', e.target.value)}
              disabled={!settings.enabled}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="primary" onClick={onSave}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdminPage;