import Layout from "../../../components/Layout";
import { useContext } from "react";
import { ProductsContext } from "../../../components/ProductsContext";
import { initMongoose } from '../../../lib/mongoose';
import Order from '../../../models/order';
import { useRouter } from 'next/router';

export default function InvoicePage({orderData}) {
  const router = useRouter();
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);

  // Format date consistently using UTC to avoid hydration errors
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC'  // Use UTC to ensure consistency
    });
  };

  if (!orderData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </Layout>
    );
  }

  const handleReturnHome = () => {
    // Clear the cart by setting selectedProducts to empty array
    setSelectedProducts([]);
    // Redirect to home page
    router.push('/');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white rounded-xl p-6">
        <div className="border-b border-emerald-500 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-emerald-500">Order Confirmation</h1>
          <p className="text-gray-600 mt-2">Order #{orderData._id}</p>
          <p className="text-gray-600">
            Date: {formatDate(orderData.orderDate)}
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Name:</strong> {orderData.name}</p>
              <p className="text-gray-600"><strong>Email:</strong> {orderData.email}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {orderData.phoneno}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Address:</strong> {orderData.address}</p>
              <p className="text-gray-600"><strong>City:</strong> {orderData.city}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Order Items</h2>
          <div className="space-y-4">
            {orderData.products.map((product) => (
              <div key={product.productId} className="flex mb-5">
                <div className="bg-gray-100 p-3 rounded-xl shrink-0">
                  <img src={product.picture} alt={product.name} className="w-24"/>
                </div>
                <div className="pl-4">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <div className="flex mt-2">
                    <div className="grow text-gray-600">
                      ${product.price} × {product.quantity}
                    </div>
                    <div className="text-emerald-500 font-bold">
                      ${(product.quantity * product.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t-2 border-dashed border-emerald-500 pt-4">
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
            <h3 className="font-bold">${orderData.subtotal.toFixed(2)}</h3>
          </div>
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Delivery:</h3>
            <h3 className="font-bold">${orderData.delivery.toFixed(2)}</h3>
          </div>
          <div className="flex my-3 border-t-2 pt-3 border-dashed border-emerald-500">
            <h3 className="grow font-bold text-gray-400">Total:</h3>
            <h3 className="font-bold">${orderData.total.toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <button 
            onClick={() => window.print()} 
            className="bg-emerald-500 px-5 py-2 rounded-xl font-bold text-white w-full shadow-emerald-300 shadow-lg hover:bg-emerald-600 transition-colors"
          >
            Print Invoice
          </button>
          
          <button 
            onClick={handleReturnHome}
            className="bg-gray-500 px-5 py-2 rounded-xl font-bold text-white w-full shadow-gray-300 shadow-lg hover:bg-gray-600 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  await initMongoose();
  
  try {
    const order = await Order.findById(params.orderid);
    if (!order) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        orderData: JSON.parse(JSON.stringify(order))
      }
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      notFound: true
    };
  }
}