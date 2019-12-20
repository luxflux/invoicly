import React, { useState, useEffect } from 'react';
import './App.css';

import { send } from './client-ipc';

function App() {
  const [products, setProducts] = useState(null);

  const fetchProducts = () => {
    send('fetch-products').then(products => {
      setProducts(products);
    });
  };

  const addProduct = () => {
    send('create-product', { name: 'Product #1', price: '9.99' }).then(() => {
      fetchProducts();
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!window.ipcReady) {
    return <div>Loading App ...</div>;
  }
  return (
    <div>
      <button onClick={addProduct}>Create Product</button>

      {!products && <div>Loading Products ...</div>}
      {products && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
