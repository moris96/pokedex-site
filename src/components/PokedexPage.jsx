import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';

const PokedexPage = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');
  const [next, setNext] = useState();
  const [prev, setPrev] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokeData, setFilteredPokeData] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const getPokemon = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setNext(res.data.next);
      setPrev(res.data.previous);
      await getPokeData(res.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      setLoading(false);
    }
  };

  const getPokeData = async (results) => {
    try {
      const pokemonDetails = await Promise.all(
        results.map(async (pokemon) => {
          const response = await axios.get(pokemon.url);
          return response.data;
        })
      );

      setPokeData(pokemonDetails.map((pokemon) => ({ ...pokemon, isClicked: false })));
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  const handleNext = () => {
    setUrl(next);
  };

  const handlePrev = () => {
    setUrl(prev);
  };

  const handleCardClick = async (id) => {
    if (pokeData.find((pokemon) => pokemon.id === id).details) {
      setPokeData((prevData) =>
        prevData.map((pokemon) =>
          pokemon.id === id ? { ...pokemon, isClicked: !pokemon.isClicked } : pokemon
        )
      );
    } else {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        const details = response.data;
        setPokeData((prevData) =>
          prevData.map((pokemon) =>
            pokemon.id === id ? { ...pokemon, isClicked: !pokemon.isClicked, details } : pokemon
          )
        );
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    }
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  useEffect(() => {
    getPokemon();
  }, [url]);

  useEffect(() => {
    const filteredPokemon = pokeData.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedType || pokemon.types.some((type) => type.type.name === selectedType))
    );
    setFilteredPokeData(filteredPokemon);
  }, [searchTerm, pokeData, selectedType]);
  
  
  

  const typeOptions = [
    'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying',
    'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Pokedex</h1>

      {/* search component */}
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} allPokemon={pokeData} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="row">
            {/* next/prev buttons on top */}
            <div className="mt-4">
              {prev && <button onClick={handlePrev}>Previous</button>}
              {next && <button onClick={handleNext}>Next</button>}
            </div>
            {/* Type filter dropdown */}
            <div className="mt-4">
              <label htmlFor="typeFilterDropdown">Filter by Type:</label>
              <select
                id="typeFilterDropdown"
                className="form-control"
                value={selectedType || 'All'}
                onChange={(e) => handleTypeFilter(e.target.value === 'All' ? null : e.target.value)}
              >
                <option value="All">All</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {filteredPokeData.map((pokemon) => (
              <div key={pokemon.id} className="col-md-3 mb-3">
                <div className="card" onClick={() => handleCardClick(pokemon.id)}>
                  {pokemon.isClicked ? (
                    <div className="card-body">
                      <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        className="card-img-top"
                      />
                      <h5 className="card-title">{pokemon.name}</h5>
                      <p className="card-text">
                        <strong>ID:</strong> {pokemon.id}<br />
                        <strong>Height:</strong> {pokemon.height / 10}m<br />
                        <strong>Weight:</strong> {pokemon.weight / 10}kg<br />
                        <strong>Type:</strong>{' '}
                        {pokemon.types.map((type) => type.type.name).join(', ')}
                      </p>
                      <h6 className="card-subtitle mb-2 text-muted">Base Stats:</h6>
                      <ul className="list-group">
                        {pokemon.stats.map((stat) => (
                          <li key={stat.stat.name} className="list-group-item">
                            <strong>{stat.stat.name}:</strong> {stat.base_stat}
                          </li>
                        ))}
                        <li className="list-group-item">
                          <strong>total:</strong>{' '}
                          {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        className="card-img-top"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{pokemon.name}</h5>
                        <p className="card-text">
                          <strong>ID:</strong> {pokemon.id}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* next/prev buttons at the bottom */}
          <div className="mt-4">
            {prev && <button onClick={handlePrev}>Previous</button>}
            {next && <button onClick={handleNext}>Next</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokedexPage;
