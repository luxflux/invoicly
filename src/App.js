import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Products from './Products';

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/invoices">Rechnungen</Link></li>
            <li><Link to="/customers">Kunden</Link></li>
            <li><Link to="/products">Produkte</Link></li>
          </ul>
        </nav>
      </div>

      <Switch>
        <Route path="/products">
          <Products />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
