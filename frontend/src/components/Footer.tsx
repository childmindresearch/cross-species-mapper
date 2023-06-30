// @ts-expect-error because react not used.
import React from 'react'

interface FooterProps {
  companyName: string
}

const Footer = ({ companyName }: FooterProps): JSX.Element => {
  return (
    <footer className="mt-5">
        <p>&copy; {new Date().getFullYear()} {companyName}</p>
    </footer>
  )
}

export default Footer
