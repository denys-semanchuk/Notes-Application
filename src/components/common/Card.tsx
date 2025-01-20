import React from 'react';

const Card: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

export default Card;