import './Search.css'

import React, { useState, useEffect } from 'react';

function Search({ orientation }) {

  const [busca, setBusca] = useState("");


  useEffect(() => {

    return () => {

    };

  }, []);

  return (
    <footer className={`search ${orientation}`}>
      <div className="search-container">
        <input
          type="text"
          placeholder="O que você procura?"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </footer>
  );
}

export default Search;