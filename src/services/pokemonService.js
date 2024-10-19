import { pokeApi, backendApi } from "./api";

export const pokemonService = {
  async getPokemonList(limit = 20, offset = 0) {
    try {
      const { data } = await pokeApi.get(`/pokemon`, {
        params: { limit, offset },
      });

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const { data: details } = await pokeApi.get(pokemon.url);
          return this.formatPokemonData(details);
        })
      );

      return {
        pokemon: pokemonDetails,
        total: data.count,
        next: data.next,
        previous: data.previous,
      };
    } catch (error) {
      console.error("Error fetching pokemon list:", error);
      throw error;
    }
  },

  async getPokemonById(id) {
    try {
      const { data } = await pokeApi.get(`/pokemon/${id}`);
      return this.formatPokemonData(data);
    } catch (error) {
      console.error(`Error fetching pokemon ${id}:`, error);
      throw error;
    }
  },

  async searchPokemon(query) {
    try {
      const { data } = await pokeApi.get(`/pokemon/${query.toLowerCase()}`);
      return [this.formatPokemonData(data)];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const { data } = await pokeApi.get("/pokemon", {
          params: { limit: 1000 },
        });
        const matchingPokemon = data.results.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        const detailedPokemon = await Promise.all(
          matchingPokemon.map(async (p) => {
            const { data } = await pokeApi.get(p.url);
            return this.formatPokemonData(data);
          })
        );
        return detailedPokemon;
      }
      console.error(`Error searching pokemon ${query}:`, error);
      throw error;
    }
  },

  async getPokemonTypes() {
    try {
      const { data } = await pokeApi.get("/type");
      return data.results;
    } catch (error) {
      console.error("Error fetching pokemon types:", error);
      throw error;
    }
  },
  formatPokemonData(data) {
    return {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other?.["official-artwork"]?.front_default ||
        data.sprites.other?.["home"]?.front_default ||
        data.sprites.front_default,
      types: data.types.map((type) => type.type.name),
      stats: data.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((ability) => ability.ability.name),
      price: Math.floor(Math.random() * 100) + 10,
    };
  },

  async getCartItems() {
    try {
      const { data } = await backendApi.get("/items");
      return data;
    } catch (error) {
      console.error("Error al obtener los elementos del carrito:", error);
      throw error;
    }
  },
  async addToCart(pokemon) {
    try {
    
      const { data } = await backendApi.post("/items", {
        name: pokemon.name,
        image: pokemon.image,
        price: pokemon.price,
        purchased: false,
      });
      return data;
    } catch (error) {
      console.error(
        "Error adding item to cart:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  async removeFromCart(mongoId) {
    if (!mongoId) {
      throw new Error("ID de MongoDB no válido");
    }
    try {
      const response = await backendApi.delete(`/items/${mongoId}`);

      return response.data;
    } catch (error) {
      console.error("Error al eliminar el artículo del carrito:", error);
      throw error;
    }
  },

  async togglePurchaseStatus(mongoId) {
    try {
      const { data } = await backendApi.put(`/items/${mongoId}`, {
        purchased: true,
      });
      return data;
    } catch (error) {
      console.error("Error toggling purchase status:", error);
      throw error;
    }
  },
};

export default pokemonService;
