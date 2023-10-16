/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { getBooksNotInTheOrder, getOrderDetails } from '../../api/mergedData';
import {
  createOrderBook, deleteBookOrder, getSingleBookOrder, updateOrderBook,
} from '../../api/orderBookData';

export default function ViewOrder() {
  const [orderDetails, setOrderDetails] = useState({});
  const [booksNotInOrder, setBooksNotInOrder] = useState([]);
  const { user } = useAuth();

  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    getOrderDetails(firebaseKey).then(setOrderDetails);
    getBooksNotInTheOrder(user.uid, firebaseKey).then(setBooksNotInOrder);
  }, [firebaseKey, user.uid, orderDetails]);

  const addBookToOrder = (bookFirebaseKey) => {
    const payload = { orderId: orderDetails.firebaseKey, bookId: bookFirebaseKey };
    createOrderBook(payload).then(({ name }) => {
      const patchPayload = { firebaseKey: name };
      updateOrderBook(patchPayload).then(() => router.push(`/order/${firebaseKey}`));
    });
  };

  const deleteBookFromOrder = (bookId) => {
    getSingleBookOrder(bookId, firebaseKey).then((orderBook) => deleteBookOrder(orderBook.firebaseKey));
  };
  const total = orderDetails.orderBooks?.reduce((prev, next) => prev + +next.price, 0);

  return (
    <>
      <div className="mt-5 d-flex flex-wrap">
        <div className="d-flex flex-column">
          <div className="text-white ms-5 details">
            <h2>{orderDetails.customer_name}</h2>
            <p>{orderDetails.orderType}</p>
            Order Email: <a href={`mailto:${orderDetails.email}`}>{orderDetails.email}</a>
            <h4>Order Total ${total?.toFixed(2)}</h4>
            <h2>Books In Order</h2>
          </div>
          <div className="d-flex flex-wrap">
            { orderDetails.orderBooks?.map((book) => (
              <Card style={{ width: '10rem', margin: '10px' }}>
                <Card.Img variant="top" src={book.image} alt={book.title} style={{ height: '150px' }} />
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="card-text bold">{ book.sale ? `🏷️ Sale $${book.price}` : `$${book.price}` }</p>
                  <Link href={`/book/${book.firebaseKey}`} passHref>
                    <Button variant="primary" size="sm" className="m-2">VIEW</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => deleteBookFromOrder(book.firebaseKey)} className="m-2">
                    DELETE
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
          <h3 className="text-white ms-5 details"> Add Books to Order</h3>
          <div className="d-flex flex-wrap">
            { booksNotInOrder.map((book) => (
              <Card style={{ width: '10rem', margin: '10px' }}>
                <img className="card-img-top" src={book.image} alt={book.title} style={{ height: '80px', width: '80px' }} />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text bold">{ book.sale ? `🏷️ Sale $${book.price}` : `$${book.price}` }</p>
                </div>
                <Button size="sm" onClick={() => addBookToOrder(book.firebaseKey)}> Add Book To Bag</Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
