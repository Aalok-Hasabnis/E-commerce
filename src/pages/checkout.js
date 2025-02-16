import Layout from "../../components/Layout";
import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../../components/ProductsContext";
import { useRouter } from "next/router";

export default function CheckOut() {
  const router = useRouter();
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [productInfo, setProductInfo] = useState([]);
  const [address, setAddress] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formValid, setFormValid] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const uniqIds = [...new Set(selectedProducts)];
      fetch(`/api/products?ids=${uniqIds.join(',')}`)
        .then(response => response.json())
        .then(json => setProductInfo(json))
        .catch(error => console.error(error));
    } else {
      setProductInfo([]);
    }
  }, [selectedProducts]);

  useEffect(() => {
    // Check if all fields are filled
    if (address && city && name && email && phoneno) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [address, city, name, email, phoneno]);

  function moreOfThisProduct(id) {
    setSelectedProducts(prev => [...prev, id]);
  }

  function lessOfThisProduct(id) {
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      setSelectedProducts(prev => prev.filter((value, index) => index !== pos));
    }
  }

  const delivery = selectedProducts.length > 0 ? 5 : 0;  
  let subtotal = 0;
  if (selectedProducts?.length && productInfo?.length) {
    for (let id of selectedProducts) {
      const product = productInfo.find(p => p._id === id);
      if (product) {
        subtotal += product.price;
      }
    }
  }
  const total = subtotal + delivery;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Send POST request to your backend for payment processing
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phoneno,
          address,
          city,
          email,
          products: selectedProducts.join(","),
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Payment successful, redirect to invoice page
        router.push(`/invoice/${data.orderId}`);
      } else {
        // Handle any errors from backend response
        console.error("Error processing payment:", response.statusText);
        // You might want to display an error message to the user here
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle network errors or other exceptions
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false); // Set isSubmitting back to false
    }
  };

  return (
    <Layout>
      {!productInfo.length && (
        <div>No products in the Shopping Cart</div>
      )}
      {productInfo.length > 0 && productInfo.map(product => {
        const amount = selectedProducts.filter(id => id === product._id).length;
        if (amount === 0) return null;
        return (
          <div key={product._id} className="flex mb-5">
            <div className="bg-gray-100 p-3 rounded-xl shrink-0">
              <img className="w-24" src={product.picture} alt={product.name} />
            </div>
            <div className="pl-4">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-sm leading-4 text-gray-500">{product.description}</p>
              <div className="flex">
                <div className="grow">${product.price}</div>
                <div>
                  <button
                    onClick={() => lessOfThisProduct(product._id)}
                    className="border border-emerald-500 px-2 rounded-lg text-emerald-500">
                    -
                  </button>
                  <span className="px-5">
                    {amount}
                  </span>
                  <button
                    onClick={() => moreOfThisProduct(product._id)}
                    className="bg-emerald-500 px-2 rounded-lg text-white">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <form action="/api/checkout" method="POST">
        <div className="mt-4">
          <input
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Your Name"
            className="w-full rounded-lg px-4 py-2 mb-2 border border-gray-300 focus:outline-none focus:border-emerald-500"
          />
          <input
            name="phoneno"
            value={phoneno}
            onChange={e => setPhoneno(e.target.value)}
            type="tel"
            placeholder="Enter Phone Number"
            className="w-full rounded-lg px-4 py-2 mb-2 border border-gray-300 focus:outline-none focus:border-emerald-500"
          />
          <input
            name="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            type="text"
            placeholder="Address"
            className="w-full rounded-lg px-4 py-2 mb-2 border border-gray-300 focus:outline-none focus:border-emerald-500"
          />
          <input
            name="city"
            value={city}
            onChange={e => setCity(e.target.value)}
            type="text"
            placeholder="City and State"
            className="w-full rounded-lg px-4 py-2 mb-2 border border-gray-300 focus:outline-none focus:border-emerald-500"
          />
          
          <input
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg px-4 py-2 mb-2 border border-gray-300 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="mt-4">
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">SubTotal: </h3>
            <h3 className="font-bold">${subtotal} </h3>
          </div>

          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Delivery: </h3>
            <h3 className="font-bold">${delivery} </h3>
          </div>

          <div className="flex my-3 border-t-2 pt-3 border-dashed border-emerald-500">
            <h3 className="grow font-bold text-gray-400">Total: </h3>
            <h3 className="font-bold">${total} </h3>
          </div>
        </div>

        <input type="hidden" name="products" value={selectedProducts.join(',')} />

        <button
          type="submit"
          className="bg-emerald-500 px-5 py-2 rounded-xl font-bold text-white w-full my-4 shadow-emerald-300 shadow-lg"
          disabled={!formValid} 
        >
          Pay ${total}
        </button>
      </form>
    </Layout>
  );
}
