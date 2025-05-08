import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaBook, FaStar, FaSpinner, FaExclamationTriangle, FaHeart, FaRegHeart, FaShare, FaCheck, FaFilter, FaUser, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

// Use environment variable for API key
const GOOGLE_BOOKS_API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

const BookRecommendation = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const booksPerPage = 6;

  // Get unique genres, years, and ratings for filters
  const genres = ['All Genres', ...new Set(books.map(book => book.genre))];
  const years = ['All Years', ...new Set(books.map(book => book.year))];
  const ratings = ['All Ratings', '4.5+', '4.0+', '3.5+', '3.0+'];

  // Verify API connection on component mount
  useEffect(() => {
    const verifyApiConnection = async () => {
      if (!GOOGLE_BOOKS_API_KEY) {
        console.error('API Key is missing:', process.env);
        setError('Google Books API key is missing. Please check your .env file.');
        toast.error('API key is missing');
        return;
      }

      try {
        console.log('Verifying API connection with key:', GOOGLE_BOOKS_API_KEY);
        const response = await axios.get(`${GOOGLE_BOOKS_API_URL}?q=test&key=${GOOGLE_BOOKS_API_KEY}`);
        console.log('API connection successful:', response.status === 200);
        toast.success('Connected to Google Books API');
      } catch (error) {
        console.error('API connection error:', error.response?.data || error);
        if (error.response?.data?.error?.message) {
          setError(`API Error: ${error.response.data.error.message}`);
        } else {
          setError('Failed to connect to Google Books API. Please check your API key.');
        }
        toast.error('Failed to connect to Google Books API');
      }
    };

    verifyApiConnection();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    if (!GOOGLE_BOOKS_API_KEY) {
      setError('Google Books API key is missing. Please add your API key to the code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching Google Books API for:', query);
      
      const response = await axios.get(`${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}`);
      
      if (response.data && response.data.items) {
        const formattedBooks = response.data.items.map(item => {
          const volumeInfo = item.volumeInfo;
          return {
            id: item.id,
            title: volumeInfo.title,
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
            description: volumeInfo.description || 'No description available',
            rating: volumeInfo.averageRating || 0,
            genre: volumeInfo.categories ? volumeInfo.categories[0] : 'Uncategorized',
            year: volumeInfo.publishedDate ? volumeInfo.publishedDate.split('-')[0] : 'Unknown',
            imageUrl: volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover',
            isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || 'N/A',
            publisher: volumeInfo.publisher || 'Unknown Publisher',
            language: volumeInfo.language || 'Unknown',
            pages: volumeInfo.pageCount || 0,
            price: volumeInfo.saleInfo?.listPrice?.amount || 0
          };
        });

        console.log('Found books:', formattedBooks.length);
        setBooks(formattedBooks);
        toast.success(`Found ${formattedBooks.length} books`);
      } else {
        setBooks([]);
        toast.info('No books found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching books:', error);
      if (error.response?.data?.error?.message) {
        setError(`API Error: ${error.response.data.error.message}`);
      } else {
        setError('Failed to search books. Please try again.');
      }
      toast.error('Failed to search books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect for real-time search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        debouncedSearch(searchQuery);
      } else {
        setBooks([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (book) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.title === book.title);
      if (isFavorite) {
        toast.info('Book removed from favorites');
        return prev.filter(fav => fav.title !== book.title);
      } else {
        toast.success('Book added to favorites');
        return [...prev, book];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Recommendations</h1>
          <p className="text-lg text-gray-600">Search millions of books from Google Books</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search for books by title, author, or ISBN..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
            <FaExclamationTriangle className="inline-block mr-2" />
            {error}
          </div>
        )}

        {/* Results Section */}
        {!isLoading && currentBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBooks.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {book.rating > 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold flex items-center">
                      <FaStar className="mr-1" />
                      {book.rating}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">by {book.author}</p>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{book.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {book.genre}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {book.year}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">
                      {book.price > 0 ? `$${book.price}` : 'Price not available'}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded ${
                  currentPage === number
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && books.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">No books found. Please try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRecommendation; 