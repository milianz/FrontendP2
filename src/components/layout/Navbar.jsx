import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cartItems } = useCart();

  return (
    <nav className="bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">PokéShop</Link>
        <div className="flex items-center gap-4">
          <SearchBar />
          <Link to="/cart" className="p-2 hover:bg-red-700 rounded-full relative">
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-400 text-xs text-black rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;