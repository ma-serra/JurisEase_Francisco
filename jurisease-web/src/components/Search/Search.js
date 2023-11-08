import './Search.css'

import React, { useState } from 'react';

function Search() {

  const [busca, setBusca] = useState("");

  return (
    <div className={`Search`}>
      <div className="search-container">
        <input
          type="text"
          placeholder="O que você procura?"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Search;