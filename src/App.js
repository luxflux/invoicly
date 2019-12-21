import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import { Navbar, Spinner } from '@blueprintjs/core';
import * as IPC from './client-ipc';

import Products from './Products';

import './App.css';

function App() {
  const [ipcReady, setIPCReady] = useState(false);
  useEffect(() => {
    IPC.init().then(() => {
      setIPCReady(true);
    });
  }, []);

  if (!ipcReady) {
    return (
      <div className="app-content">
        <Spinner size={Spinner.SIZE_STANDARD} />
      </div>
    );
  }

  return (
    <Router>
      <Navbar>
        <Navbar.Group align="left">
          <Navbar.Heading>Invoicly</Navbar.Heading>
          <Navbar.Divider />
          <NavLink activeClassName="bp3-active" className="bp3-button bp3-minimal" to="/invoices">
            Rechnungen
          </NavLink>
          <NavLink activeClassName="bp3-active" className="bp3-button bp3-minimal" to="/customers">
            Kunden
          </NavLink>
          <NavLink activeClassName="bp3-active" className="bp3-button bp3-minimal" to="/products">
            Produkte
          </NavLink>
        </Navbar.Group>
      </Navbar>

      <div className="app-content">
        <Switch>
          <Route path="/products">
            <Products />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
