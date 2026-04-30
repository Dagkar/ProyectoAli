import React, { useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import '../styles/search-bar.css'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <button className="search-btn">Buscar</button>
    </div>
  )
}

export default SearchBar
