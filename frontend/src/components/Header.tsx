// @ts-expect-error because react not used.
import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { FaGithub } from 'react-icons/fa'

interface HeaderProps {
  title: string
}

const Header = ({ title }: HeaderProps): JSX.Element => {
  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Navbar.Brand href="#">{title}</Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav className="mr-auto">
        <Nav.Link href="https://github.com/cmi-dair/cross-species-mapper" className="d-flex align-items-center">
            <FaGithub />
            GitHub
          </Nav.Link>
        </Nav>
        </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
