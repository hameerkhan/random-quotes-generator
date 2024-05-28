import React, { useState, useEffect, useRef } from 'react';
import { FaTwitter, FaHeart, FaCopy } from 'react-icons/fa';
import { AiOutlineSmile, AiOutlineMeh, AiOutlineFrown } from 'react-icons/ai';
import QRCode from 'qrcode.react'; // Import QRCode component

const RandomQuoteGenerator = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('#B45127'); // Light Cyan
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const [analysis, setAnalysis] = useState(null); // Store analysis result
  const categoriesRef = useRef([]);

  useEffect(() => {
    fetchQuote();
    fetchCategories();
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
    setFavoriteQuotes(storedFavorites);
  }, []);

  const fetchQuote = () => {
    setIsLoading(true);
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.content);
        setAuthor(data.author);
        setIsLoading(false); // Set loading state to false after fetching quote
        analyzeQuote(data.content); // Analyze the quote after fetching
      })
      .catch((error) => {
        console.error('Error fetching quote:', error);
        setIsLoading(false); // Set loading state to false in case of error
      });
  };

  const fetchCategories = () => {
    setIsLoading(true);
    if (categoriesRef.current.length === 0) {
      fetch('https://api.quotable.io/tags')
        .then((response) => response.json())
        .then((data) => {
          categoriesRef.current = data;
          setIsLoading(false); // Set loading state to false after fetching categories
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
          setIsLoading(false); // Set loading state to false in case of error
        });
    }
  };

  const handleNewQuote = () => {
    fetchQuote();
    setBackgroundColor(isDarkMode ? '#1a202c' : '#B45127'); // Set background color based on mode
  };

  const tweetQuote = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${quote} - ${author}`);
  };

  const toggleFavorite = () => {
    const isFavorite = favoriteQuotes.find((item) => item.quote === quote && item.author === author);
    if (isFavorite) {
      const updatedFavorites = favoriteQuotes.filter((item) => !(item.quote === quote && item.author === author));
      setFavoriteQuotes(updatedFavorites);
      localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
    } else {
      const newFavorite = { quote, author };
      const updatedFavorites = [...favoriteQuotes, newFavorite];
      setFavoriteQuotes(updatedFavorites);
      localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
    }
  };

  const isFavorite = favoriteQuotes.some((item) => item.quote === quote && item.author === author);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setBackgroundColor(isDarkMode ? '#B45127' : '#1a202c'); // Set background color based on mode
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim() !== '') {
      setIsLoading(true);
      fetch(`https://api.quotable.io/quotes?author=${searchTerm}&limit=5`)
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.results);
          setIsLoading(false); // Set loading state to false after fetching search results
        })
        .catch((error) => {
          console.error('Error fetching quotes:', error);
          setIsLoading(false); // Set loading state to false in case of error
        });
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setIsLoading(true);
    fetch(`https://api.quotable.io/random?tags=${event.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.content);
        setAuthor(data.author); 
        setIsLoading(false); // Set loading state to false after fetching quote by category
        analyzeQuote(data.content); // Analyze the quote after fetching
      })
      .catch((error) => {
        console.error('Error fetching quote by category:', error);
        setIsLoading(false); // Set loading state to false in case of error
      });
  };

  const analyzeQuote = (quoteText) => {
    // Simulate analysis (positive, neutral, or negative sentiment)
    const analysisResult = Math.random();
    if (analysisResult < 0.33) {
      setAnalysis(<AiOutlineFrown />);
    } else if (analysisResult < 0.66) {
      setAnalysis(<AiOutlineMeh />);
    } else {
      setAnalysis(<AiOutlineSmile />);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor }}>
      {/*  */}
      <h1 id="websitename" className="text-3xl font-bold text-center mb-8">Random Quotes Generator</h1>
{/*  */}
<div id="container1" className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search by Keyword"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none mr-2"
          />
        
        
<select
            id="categeory" className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">Select category</option>
            {categoriesRef.current.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          {/*  */}
          {(searchTerm.trim() !== '' || category === '') && (
          <div className="absolute justify-center mb-4">
            <button id="search"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
            {/*  */}
           

          </div>
        )}
         <button id="thememode" className={`bg-${isDarkMode ? 'gray' : 'blue'}-500 hover:bg-${isDarkMode ? 'gray' : 'blue'}-600 text-white font-bold py-2 px-4 rounded mr- text-end`} onClick={toggleDarkMode}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
          </div>
         
          {/*  */}
      
      <div id="Quotetext" className={`max-w-lg rounded-lg p-8 shadow-md text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <h2 id="Quotestext"className="text-2xl mb-4">{quote}</h2>
        <p  id="author" className="text-sm italic mb-4">- {author}</p>
        <div id="container2" className="flex justify-center mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mr-4"
            onClick={tweetQuote}
          >
            <FaTwitter className="inline-block mr-1" /> Tweet Quote
          </button>
          <button
            className={`bg-${isFavorite ? 'red' : 'gray'}-500 hover:bg-${isFavorite ? 'red' : 'gray'}-600 text-white font-bold py-2 px-6 rounded`}
            onClick={toggleFavorite}
          >
            <FaHeart className="inline-block mr-1" /> {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded ml-4"
            onClick={copyToClipboard}
          >
            <FaCopy className="inline-block mr-1" /> Copy Quote
          </button>
        </div>
        
       
        {isLoading && <p>Loading...</p>}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">Search Results</h2>
            {searchResults.map((result, index) => (
              <div key={index} className="mb-2">
                <p>{result.content}</p>
                <p className="text-sm italic">- {result.author}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mb-4">
         
          <button id="new"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
            onClick={handleNewQuote}
          >
            New Quote
          </button>
        </div>
        {quote && (
          <div id="QR"className="flex justify-center">
            <QRCode value={`${quote} - ${author}`} size={150} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomQuoteGenerator;
