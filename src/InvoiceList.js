import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { H1, Button, HTMLTable, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { send } from './client-ipc';
import Amount from './Amount';

function InvoiceList() {
  const [invoices, setInvoices] = useState(null);
  const [customers, setCustomers] = useState(null);
  const history = useHistory();

  const createInvoice = customer => {
    const data = {
      customerId: customer.id,
      date: new Date(),
    };
    send('create-invoice', data).then(invoice => {
      fetchInvoices();
      history.push(`/invoices/${invoice.id}/edit`);
    });
  };

  const fetchInvoices = () => {
    send('fetch-invoices').then(invoices => {
      setInvoices(invoices);
    });
  };

  const fetchCustomers = () => {
    send('fetch-customers').then(customers => {
      setCustomers(customers);
    });
  };

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const showSkeleton = !invoices || !customers;

  return (
    <div>
      <H1>Rechnungen</H1>
      <HTMLTable>
        <thead>
          <tr>
            <th>Nummer</th>
            <th>Kunde</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(invoices || []).map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.number}</td>
              <td>{invoice.customer.name}</td>
              <td>
                <Amount amount={invoice.total} />
              </td>
              <td>
                <Link to={`/invoices/${invoice.id}/edit`}>
                  <Button icon="edit" text="Bearbeiten" small={true} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">
              <Select
                className={showSkeleton ? 'bp3-skeleton' : null}
                items={customers || []}
                itemRenderer={(customer, { handleClick }) => (
                  <MenuItem key={customer.id} onClick={handleClick} text={`${customer.asTitle}`} />
                )}
                onItemSelect={customer => {
                  createInvoice(customer);
                }}
                noResults={<MenuItem disabled={true} text="No results." />}
              >
                <Button text="Neue Rechnung erstellen" rightIcon="double-caret-vertical" />
              </Select>
            </td>
          </tr>
        </tfoot>
      </HTMLTable>
    </div>
  );
}

export default InvoiceList;
