import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getOrders } from '../api/orderData';
import OrderCard from '../components/OrderCard';

export default function ShowOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  const getAllTheOrders = () => {
    getOrders(user.uid).then(setOrders);
  };

  useEffect(() => {
    getAllTheOrders();
  }, []);

  return (
    <>
      <div className="text-center my-4">
        <Link href="/order/new" passHref>
          <Button>Add an Order</Button>
        </Link>
        {orders.map((order) => <OrderCard key={order.firebaseKey} orderObj={order} onUpdate={getAllTheOrders} />)}
      </div>
    </>
  );
}
