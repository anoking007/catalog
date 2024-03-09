import React, { useState, useEffect } from 'react';
import './App.css';

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function App() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://api.punkapi.com/v2/beers')
      .then(response => response.json())
      .then(data => setBeers(data))
      .catch(error => console.log(error));
  }, []);

  const debouncedSearchTerm = debounce(searchTerm => {
    setSearchTerm(searchTerm);
  }, 300);

  const handleSearchChange = event => {
    const term = event.target.value;
    debouncedSearchTerm(term);
  };

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-brown min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center">
          Beer Catalog
        </h1>
        <input
          type="text"
          placeholder="Search Beers"
          onChange={handleSearchChange}
          className="w-full border border-gray-300 rounded-md py-2 px-4 mb-4 focus:outline-none focus:border-blue-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeers.map(beer => (
            <div key={beer.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={beer.image_url} alt={beer.name} className="w-40 h-40 object-scale-down" />
              <div className="p-4 bg-yellow-100">
                <h2 className="text-xl font-semibold mb-2 text-brown">{beer.name}</h2>
                <p className="text-gray-600 mb-2">{beer.tagline}</p>
                <p className="text-gray-600 mb-2">First Brewed: {beer.first_brewed}</p>
                <p className="text-gray-600">ABV: {beer.abv}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
