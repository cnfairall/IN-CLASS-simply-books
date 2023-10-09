import React from 'react';
import { Card } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';

export default function User() {
  const { user } = useAuth();

  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Img variant="top" src={user.imageURL} alt={user.displayName} style={{ height: '400px' }} />
      <Card.Body>
        <Card.Title>{user.displayName}</Card.Title>
        <p className="card-text bold">{user.email}</p>
      </Card.Body>
    </Card>
  );
}
