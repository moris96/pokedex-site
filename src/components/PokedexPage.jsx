// PokedexPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';

const PokedexPage = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=10');
  const [next, setNext] = useState();
  const [prev, setPrev] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokeData, setFilteredPokeData] = useState([]);

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

      setPokeData(pokemonDetails);
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

  useEffect(() => {
    getPokemon();
  }, [url]);

  useEffect(() => {
    // Filter the Pokemon data based on the search term
    const filteredPokemon = pokeData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokeData(filteredPokemon);
  }, [searchTerm, pokeData]);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Pokedex</h1>

      {/* Use the SearchBar component */}
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="row">
            {filteredPokeData.map((pokemon) => (
              <div key={pokemon.id} className="col-md-3 mb-3">
                <div className="card">
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{pokemon.name}</h5>
                    <p className="card-text">
                      <strong>Height:</strong> {pokemon.height / 10}m<br />
                      <strong>Weight:</strong> {pokemon.weight / 10}kg
                    </p>
                    <h6 className="card-subtitle mb-2 text-muted">Base Stats:</h6>
                    <ul className="list-group">
                      {pokemon.stats.map((stat) => (
                        <li key={stat.stat.name} className="list-group-item">
                          <strong>{stat.stat.name}:</strong> {stat.base_stat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
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