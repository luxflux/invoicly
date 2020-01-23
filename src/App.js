import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import { Navbar, Spinner } from '@blueprintjs/core';
import * as IPC from './client-ipc';

import Products from './Products';
import Customers from './Customers';
import InvoiceList from './InvoiceList';
import InvoiceEdit from './InvoiceEdit';
import Settings from './Settings';
import SettingsContext from './SettingsContext';

import './App.css';

const DEFAULT_SETTINGS = {
  name: '',
  street: '',
  zipCode: '',
  city: '',
  country: '',
  iban: '',
  invoiceText: '',
};

function App() {
  const [ipcReady, setIPCReady] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    IPC.init().then(() => {
      setIPCReady(true);
      const settingsFromLocalStorage = localStorage.getItem('settings');
      if (settingsFromLocalStorage) {
        setSettings(JSON.parse(settingsFromLocalStorage));
      }
    });
  }, []);

  const updateSettings = setting => {
    const newSettings = {
      ...settings,
      ...setting,
    };
    localStorage.setItem('settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  if (!ipcReady) {
    return (
      <div className="app-content">
        <Spinner size={Spinner.SIZE_STANDARD} />
      </div>
    );
  }

  return (
    <Router>
      <SettingsContext.Provider value={{ settings, updateSettings }}>
        <Navbar className="navigation">
          <Navbar.Group align="left">
            <Navbar.Heading>Invoicly</Navbar.Heading>
            <Navbar.Divider />
            <NavLink activeClassName="bp3-active" className="bp3-button bp3-minimal" to="/invoices">
              Rechnungen
            </NavLink>
            <NavLink
              activeClassName="bp3-active"
              className="bp3-button bp3-minimal"
              to="/customers"
            >
              Kunden
            </NavLink>
            <NavLink activeClassName="bp3-active" className="bp3-button bp3-minimal" to="/products">
              Produkte
            </NavLink>
            <NavLink activeClassName="bp3-active" className="bp3-button bp3-minimal" to="/settings">
              Einstellungen
            </NavLink>
          </Navbar.Group>
        </Navbar>

        <div className="app-content">
          <Switch>
            <Route path="/invoices/:invoiceId/edit">
              <InvoiceEdit />
            </Route>
            <Route exact={true} path="/invoices">
              <InvoiceList />
            </Route>
            <Route exact={true} path="/customers">
              <Customers />
            </Route>
            <Route exact={true} path="/products">
              <Products />
            </Route>
            <Route exact={true} path="/settings">
              <Settings />
            </Route>
            <Route exact={true} path="/" render={() => <Redirect to="/invoices" />} />
          </Switch>
        </div>
      </SettingsContext.Provider>
    </Router>
  );
}

export default App;
