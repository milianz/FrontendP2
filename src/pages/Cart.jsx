import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { pokemonService } from "../services/pokemonService";

const Cart = () => {
  const { cartItems, setCartItems, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await pokemonService.getCartItems();
      setCartItems(items);
    } catch (error) {
      setError("Error al cargar los artículos del carrito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (mongoId) => {

    if (!mongoId) {
      console.error("ID de MongoDB no válido");
      setError("No se puede eliminar el artículo debido a un ID no válido.");
      return;
    }
    try {
      await removeFromCart(mongoId);
      await fetchCartItems();
    } catch (error) {
      setError("Error al eliminar el artículo del carrito.");
    }
  };

  const handleTogglePurchase = async (mongoId) => {

    if (!mongoId) {
      setError(
        "No se puede cambiar el estado del artículo debido a un ID no válido."
      );
      return;
    }
    try {
      await pokemonService.togglePurchaseStatus(mongoId);
      await fetchCartItems();
    } catch (error) {
      setError("Error al cambiar el estado de compra del artículo.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && cartItems.length === 0 && (
        <p>
          Tu carrito está vacío.{" "}
          <Link to="/" className="text-blue-600">
            Volver a la tienda
          </Link>
        </p>
      )}
      {!loading && !error && cartItems.length > 0 && (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold capitalize">
                    {item.name}
                  </h2>
                  <p className="text-gray-600">${item.price}</p>
                  <p
                    className={`text-sm ${
                      item.purchased ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.purchased ? "Comprado" : "No comprado"}
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleTogglePurchase(item._id)}
                  className={`px-4 py-2 rounded ${
                    item.purchased
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white mr-2`}
                >
                  {item.purchased
                    ? "Marcar como no comprado"
                    : "Marcar como comprado"}
                </button>
                <button
                  onClick={() => handleRemoveFromCart(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-2xl font-bold">
              Total: ${cartItems.reduce((total, item) => total + item.price, 0)}
            </p>
            <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              Proceder al pago
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
