import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PokemonGrid from "../components/pokemon/PokemonGrid";
import { pokemonService } from "../services/pokemonService";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  const { searchQuery } = useParams();
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    loadPokemon();
  }, [currentPage, searchQuery]);

  const loadPokemon = async () => {
    try {
      setLoading(true);
      let response;
      if (searchQuery) {
        response = await pokemonService.searchPokemon(searchQuery);
        setPokemon(Array.isArray(response) ? response : [response]);
      } else {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        response = await pokemonService.getPokemonList(ITEMS_PER_PAGE, offset);
        setPokemon(response.pokemon);
      }
      setError(null);
    } catch (err) {
      setError("Error al cargar los Pokémon. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (pokemonItem) => {
    try {
      await pokemonService.addToCart(pokemonItem);
      addToCart(pokemonItem);
    } catch (error) {
      setError(
        "Error al añadir Pokémon al carrito. Por favor, intenta de nuevo."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={loadPokemon}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {searchQuery
          ? `Resultados para "${searchQuery}"`
          : "Pokémon Disponibles"}
      </h1>
      {pokemon.length === 0 ? (
        <p className="text-center">No se encontraron Pokémon.</p>
      ) : (
        <PokemonGrid pokemon={pokemon} onAddToCart={handleAddToCart} />
      )}
      {!searchQuery && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-400"
          >
            Anterior
          </button>
          <span className="px-4 py-2">Página {currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
