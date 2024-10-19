import React from "react";
import PokemonCard from "./PokemonCard";

const PokemonGrid = ({ pokemon, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pokemon.map((poke) => (
        <PokemonCard key={poke.id} pokemon={poke} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default PokemonGrid;
