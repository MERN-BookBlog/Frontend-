import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookDetailPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ user: '', rating: 5, comment: '' });

  useEffect(() => {
    // Fetch book details
    fetch(`/api/books/${bookId}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('Error fetching book:', err));

    // Fetch reviews
    fetch(`/api/books/${bookId}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error fetching reviews:', err));
  }, [bookId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/books/${bookId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    })
      .then(res => res.json())
      .then(addedReview => {
        setReviews([...reviews, addedReview]);
        setNewReview({ user: '', rating: 5, comment: '' });
      })
      .catch(err => console.error('Error posting review:', err));
  };

  if (!book) return <div className="p-6">Loading book details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Book Info */}
      <div className="flex gap-6 mb-10">
        <img
          src={book.cover}
          alt={book.title}
          className="w-40 h-60 object-cover rounded-xl shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <h2 className="text-lg text-gray-600">by {book.author}</h2>
          <p className="mt-2 text-gray-700">{book.description}</p>
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>Genre: {book.genre}</p>
            <p>Published: {book.published}</p>
            <p>Rating: {book.rating}⭐</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">User Reviews</h3>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">{review.user}</h4>
                <span className="text-yellow-500">{review.rating}⭐</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Submit a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white border p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Your name"
            value={newReview.user}
            onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} ⭐</option>
            ))}
          </select>
          <textarea
            placeholder="Your review"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookDetailPage;
