import React, { createContext, useContext, useState } from "react";
import { pokemonService } from "../services/pokemonService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (pokemon) => {
    if (!pokemon._id) {
      pokemon._id = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === pokemon._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === pokemon._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...pokemon, quantity: 1 }];
      }
    });
  };

  const removeFromCart = async (mongoId) => {
    if (!mongoId) {
      console.error("Intento de eliminar un elemento con ID undefined");
      return;
    }
    try {
      await pokemonService.removeFromCart(mongoId);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item._id !== mongoId);
        return updatedItems;
      });
    } catch (error) {
      console.error("Error al eliminar el artículo del carrito:", error);
    }
  };

  const clearCart = () => {
    console.log("Limpiando el carrito");
    setCartItems([]);
  };

  const updateCartItemQuantity = (mongoId, quantity) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item._id === mongoId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  const togglePurchaseStatus = async (mongoId) => {
    console.log("Cambiando estado de compra para:", mongoId);
    if (!mongoId) {
      console.error("Intento de cambiar estado de compra con ID undefined");
      return;
    }
    try {
      const updatedItem = await pokemonService.togglePurchaseStatus(mongoId);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === mongoId
            ? { ...item, purchased: updatedItem.purchased }
            : item
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado de compra:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        togglePurchaseStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
