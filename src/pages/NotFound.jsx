import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-xl mb-8">Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
        Volver a la página principal
      </Link>
    </div>
  );
};

export default NotFound;
