import React, { useState, useEffect } from 'react';
import useForm from 'react-hook-form';

import { send } from './client-ipc';

function Products() {
  const [products, setProducts] = useState(null);
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => {
    send('create-product', data).then(() => {
      fetchProducts();
    });
  };

  const fetchProducts = () => {
    send('fetch-products').then(products => {
      setProducts(products);
    });
  };

  const archiveProduct = () => {
    //
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!window.ipcReady) {
    return <div>Loading App ...</div>;
  }
  return (
    <div>
      {!products && <div>Loading Products ...</div>}
      {products && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reseller Preis</th>
                <th>Kunden Preis</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.net_price}</td>
                  <td>{product.gross_price}</td>
                  <td>
                    <button onClick={archiveProduct}>Archivieren</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    ref={register({ required: true })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="netPrice"
                    placeholder="Reseller Preis"
                    ref={register({ required: true })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="grossPrice"
                    placeholder="Kunden Preis"
                    ref={register({ required: true })}
                  />
                </td>
                <td>
                  <input type="submit" value="Erstellen" />
                </td>
              </tr>
            </tfoot>
          </table>
        </form>
      )}
    </div>
  );
}

export default Products;
