import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pokemonService } from "../services/pokemonService";
import { useCart } from "../context/CartContext";

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const data = await pokemonService.getPokemonById(id);
        setPokemon(data);
      } catch (err) {
        setError("Error al cargar el Pokémon. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const handleAddToCart = () => {
    if (pokemon) {
      const pokemonWithId = {
        ...pokemon,
        _id: `pokemon_${pokemon.id}`, // Usamos el ID del Pokémon como _id
      };

      addToCart(pokemonWithId);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!pokemon) {
    return <div>No se encontró el Pokémon</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        ← Volver
      </button>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 capitalize">{pokemon.name}</h1>
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-64 h-64 mx-auto mb-4"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Detalles</h2>
            <p>Altura: {pokemon.height / 10} m</p>
            <p>Peso: {pokemon.weight / 10} kg</p>
            <p>Tipos: {pokemon.types.join(", ")}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>
            {pokemon.stats.map((stat) => (
              <p key={stat.name}>
                {stat.name}: {stat.value}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Habilidades</h2>
          <ul className="list-disc list-inside">
            {pokemon.abilities.map((ability) => (
              <li key={ability} className="capitalize">
                {ability}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <span className="text-2xl font-bold">${pokemon.price}</span>
          <button
            onClick={() => addToCart(pokemon)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
