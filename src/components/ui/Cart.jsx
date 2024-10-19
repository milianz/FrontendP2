import React from "react";
import { X } from "lucide-react";

const Cart = ({ isOpen, onClose, items, onRemoveFromCart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Carrito</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-gray-500 text-center mt-8">
              Tu carrito está vacío
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={onRemoveFromCart}
                />
              ))}
            </div>
          )}
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">
                ${items.reduce((acc, item) => acc + item.price, 0)}
              </span>
            </div>
            <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
