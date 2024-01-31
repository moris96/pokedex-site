import React, {useState, useEffect} from 'react';
import axios from 'axios';

const PokedexPage = () => {

    const [pokeData, setpokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");
    const [next, setNext] = useState();
    const [prev, setPrev] = useState();
    const [dex, setDex] = useState();

    const getPokemon = async () => {
        setLoading(true);
        const res = await axios.get(url);
        setNext(res.data.next);
        setPrev(res.data.previous);
        getPokeData(res.data.results);
        setLoading(false);
    };


  return (
    <div>
      <h1>Pokemon</h1>
    </div>
  )
}

export default PokedexPage
