// @ts-expect-error because react not used.
import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { FaBookOpen, FaGithub } from 'react-icons/fa6'

const Header = (): JSX.Element => {
  return (
    <Navbar bg='light' expand='lg' fixed='top'>
      <Navbar.Brand style={{ marginLeft: '1rem' }}>Cross Species Mapper</Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
        <Nav className='mr-auto'>
          <Nav.Link
            href='https://www.sciencedirect.com/science/article/pii/S1053811920308326'
            className='d-flex align-items-center'
          >
            <FaBookOpen size={20} style={{ margin: '0 0.4rem 0 0.2rem' }} />
            Publication
          </Nav.Link>
          <Nav.Link
            href='https://github.com/cmi-dair/cross-species-mapper'
            className='d-flex align-items-center'
          >
            <FaGithub size={20} style={{ margin: '0 0.2rem 0 0.2rem' }} />
            Webapp
          </Nav.Link>
          <Nav.Link
            href='https://github.com/TingsterX/alignment_macaque-human'
            className='d-flex align-items-center'
          >
            <FaGithub size={20} style={{ margin: '0 0.2rem 0rem 0.2rem' }} />
            Data
          </Nav.Link>
        </Nav>
        <div style={{ marginRight: 5 }}>
          &copy; {new Date().getFullYear()} Child Mind Institute
        </div>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
