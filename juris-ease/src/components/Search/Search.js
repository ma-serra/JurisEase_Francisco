import './Search.css'
import React, { useEffect, useState } from 'react';

function Search({ setSearch }) {
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (setSearch != null) {
      setSearch(busca);
    }
  }, [busca, setSearch]);
  
  const handleInputChange = (e) => {
    setBusca(e.target.value);
  };

  return (
    <div className="Search">
      <div className="search-container">
        <input
          type="text"
          id="searchInput" 
          name="searchInput"
          placeholder="O que você procura?"
          value={busca}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default Search;
