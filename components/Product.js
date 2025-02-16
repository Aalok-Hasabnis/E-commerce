import { useContext, useState } from 'react';
import { ProductsContext } from './ProductsContext';


export default function Product({ _id, name, price, description, picture }) {
  const [isHovered, setIsHovered] = useState(false);
  const { setSelectedProducts } = useContext(ProductsContext);

  function addProducts() {
    setSelectedProducts(prev => [...prev, _id]);
  }

  return (
    <div className="w-64 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300">
      <div className="bg-blue-100 p-5 rounded-xl overflow-hidden">
        <img 
          src={picture} 
          alt={name}
          className="w-full h-48 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
      </div>
      <p className="text-sm mt-2 leading-5 text-gray-600 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="text-2xl font-bold text-gray-800">{price}</div>
        <button 
          className={`
            bg-emerald-500 text-white py-2 px-4 rounded-xl
            transform transition-all duration-200
            hover:bg-emerald-600 hover:shadow-md 
            active:bg-emerald-700 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={addProducts}
        >
          {isHovered ? 'Add' : '+'}
        </button>
      </div>
    </div>
  );
}