import React from 'react'

type HeaderProps = {
    headerText: string
}

const Header: React.FC<HeaderProps> = ({headerText}) => {
  return (
    <h1>{headerText}</h1>
  )
}

export default Header