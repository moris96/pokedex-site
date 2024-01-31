import React from 'react';

const Search = ({ searchTerm, onSearchChange }) => {
  return (
    <div className='mb-3'>
      <input 
      type='text'
      placeholder='search pokemon'
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className='form-control'
      />
    </div>
  );
};

export default Search
