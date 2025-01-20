import React from 'react'
import 'styles/addButton.css'

export const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <button className="add-button" onClick={onClick}>
      <span className="plus-icon">+</span>
    </button>
  )
}

interface AddButtonProps {
  onClick: () => string
}