import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { deleteOrder } from '../api/orderData';

function OrderCard({ orderObj, onUpdate }) {
  const deleteAnOrder = () => {
    if (window.confirm(`Do you want to delete order for ${orderObj.customer_name}?`)) {
      deleteOrder(orderObj.firebaseKey).then(() => onUpdate());
    }
  };

  return (
    <>
      <Card style={{ width: '18rem', margin: '10px' }}>
        <Card.Body>
          <Card.Title>{orderObj.customer_name}</Card.Title>
          <Card.Text>{orderObj.orderType}</Card.Text>
          <Card.Text>{orderObj.dateCreated}</Card.Text>
          <Link href={`/order/${orderObj.firebaseKey}`} passHref>
            <Button variant="primary" className="m-2">VIEW</Button>
          </Link>
          <Link href={`/order/edit/${orderObj.firebaseKey}`} passHref>
            <Button variant="info">EDIT</Button>
          </Link>
          <Button variant="danger" onClick={deleteAnOrder} className="m-2">
            DELETE
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

OrderCard.propTypes = {
  orderObj: PropTypes.shape({
    customer_name: PropTypes.string,
    orderType: PropTypes.string,
    email: PropTypes.string,
    firebaseKey: PropTypes.string,
    dateCreated: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default OrderCard;
