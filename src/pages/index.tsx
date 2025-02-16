import { useState } from "react";
import Product from "../../components/Product";
import { initMongoose } from "../../lib/mongoose";
import { findAllProducts } from "../../src/pages/api/products";
import Layout from "../../components/Layout";
import { Search } from "lucide-react";

export default function Home({ products = [] }) {
  const [phrase, setPhrase] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter products based on search phrase and category
  const filteredProducts = products.filter(p => {
    const matchesPhrase = phrase === '' || 
      p.name.toLowerCase().includes(phrase.toLowerCase()) ||
      p.description.toLowerCase().includes(phrase.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
    return matchesPhrase && matchesCategory;
  });

  const categoriesName = [...new Set(products.map(p => p.category))];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Section */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={phrase}
            onChange={e => setPhrase(e.target.value)}
            type="text"
            placeholder="Search for products..."
            className="bg-gray-100 w-full py-3 px-12 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Categories Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full transition-all whitespace-nowrap
              ${selectedCategory === '' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Categories
          </button>
          {categoriesName.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-all capitalize whitespace-nowrap
                ${selectedCategory === cat 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          {categoriesName.map(categoryName => {
            const productsInCategory = filteredProducts.filter(p => p.category === categoryName);
            if (productsInCategory.length === 0) return null;

            return (
              <div key={categoryName} className="scroll-mt-8" id={categoryName}>
                <h2 className="text-2xl font-bold mb-6 capitalize flex items-center">
                  <span className="mr-2">{categoryName}</span>
                  <span className="text-sm font-normal text-gray-500">
                    ({productsInCategory.length} items)
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsInCategory.map(productInfo => (
                    <div key={productInfo._id} className="w-full">
                      <Product {...productInfo} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await initMongoose();
  const products = await findAllProducts();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
