import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createOrder, updateOrder } from '../../api/orderData';

const initialState = {
  customer_name: '',
  orderType: '',
  email: '',
};

export default function OrderForm({ orderObj }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState({ ...initialState, uid: user.uid });
  const router = useRouter();

  useEffect(() => {
    if (orderObj.firebaseKey) setFormInput(orderObj);
  }, [orderObj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (orderObj.firebaseKey) {
      updateOrder(formInput).then(() => router.push(`/order/${orderObj.firebaseKey}`));
    } else {
      const payload = { ...formInput, dateCreated: new Date() };
      createOrder(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateOrder(patchPayload).then(() => router.push('/orders'));
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Customer Name"
            name="customer_name"
            value={formInput.customer_name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email Address"
            name="email"
            value={formInput.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Order Type</Form.Label>
          <Form.Control
            type="text"
            placeholder="In Person or Online?"
            name="orderType"
            value={formInput.orderType}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">{orderObj.firebaseKey ? 'Update' : 'Create'} Order
        </Button>
      </Form>
    </>
  );
}

OrderForm.propTypes = {
  orderObj: PropTypes.shape({
    customer_name: PropTypes.string,
    orderType: PropTypes.string,
    email: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

OrderForm.defaultProps = {
  orderObj: initialState,
};
