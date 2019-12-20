import React from 'react';
import logo from './logo.svg';
import './App.css';

import { send } from './client-ipc';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { products: [] };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    send('fetch-products').then(products => {
      console.log({ products });
      this.setState({ products });
    });
  };

  addProduct = () => {
    send('create-product', { name: 'Product #1', price: '9.99' }).then(() => {
      this.fetchProducts();
    });
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.addProduct}>Create Product</button>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
