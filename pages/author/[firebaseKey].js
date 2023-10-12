/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BookCard from '../../components/BookCard';
import { viewAuthorDetails } from '../../api/mergedData';

export default function ViewAuthor() {
  const [authorDetails, setAuthorDetails] = useState({});
  const router = useRouter();

  const { firebaseKey } = router.query;

  const getAuthorDetails = () => {
    viewAuthorDetails(firebaseKey).then(setAuthorDetails);
  };

  useEffect(() => {
    getAuthorDetails();
  }, []);

  return (
    <>
      <div className="mt-5 d-flex flex-wrap">
        <div className="text-white ms-5 details">
          <img src={authorDetails.image} alt={authorDetails.last_name} style={{ height: '400px' }} />
          <h5>
            {authorDetails?.first_name} {authorDetails?.last_name}
            {authorDetails?.favorite ? ' 🤍' : ''}
          </h5>
          Author Email: <a href={`mailto:${authorDetails?.email}`}>{authorDetails?.email}</a>
        </div>
      </div>
      <div>{authorDetails.books?.map((book) => (
        <BookCard key={book.firebaseKey} bookObj={book} onUpdate={getAuthorDetails} />
      ))}
      </div>
    </>
  );
}
