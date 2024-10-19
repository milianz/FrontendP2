import React from 'react';

const PokemonCard = ({ pokemon, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="w-full h-48 object-contain bg-gray-100"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
        <p className="text-gray-600">#{pokemon.id}</p>
        <div className="flex gap-2 mt-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-800"
            >
              {type}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">${pokemon.price}</span>
          <button 
            onClick={() => onAddToCart(pokemon)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;