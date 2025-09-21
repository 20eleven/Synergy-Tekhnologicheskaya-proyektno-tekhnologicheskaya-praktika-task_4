import React, { FC } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaHeart } from 'react-icons/fa';

const Header: FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Книжный Магазин</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Каталог</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/favorites">
              <Nav.Link>
                <FaHeart className="me-1" /> Ваши любимые книги
              </Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <LinkContainer to="/admin">
              <Nav.Link>Админка</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;