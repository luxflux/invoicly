import React, { useState, useEffect } from 'react';
import useForm from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import { H1, Button, HTMLTable, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { send } from './client-ipc';

function InvoiceList() {
  const [invoices, setInvoices] = useState(null);
  const [customers, setCustomers] = useState(null);
  const { register, handleSubmit, errors, setValue } = useForm();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const history = useHistory();

  const onSubmit = data => {
    const myData = {
      ...data,
      date: new Date(),
    };
    send('create-invoice', myData).then((invoice) => {
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

  useEffect(() => {
    register({ name: 'customerId' }, { required: 'benötigt' });
  }, [register]);

  const showSkeleton = !invoices || !customers;

  console.log({ errors });

  return (
    <div>
      <H1>Rechnungen</H1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                <td>{invoice.total}</td>
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
              <td colSpan="3">
                <Select
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  items={customers || []}
                  itemRenderer={(customer, { handleClick }) => (
                    <MenuItem
                      key={customer.id}
                      onClick={handleClick}
                      text={`${customer.asTitle}`}
                    />
                  )}
                  onItemSelect={customer => {
                    setSelectedCustomer(customer);
                    setValue('customerId', customer.id);
                  }}
                  noResults={<MenuItem disabled={true} text="No results." />}
                >
                  <Button
                    text={selectedCustomer ? selectedCustomer.asTitle : 'Bitte wählen...'}
                    rightIcon="double-caret-vertical"
                  />
                </Select>
              </td>
              <td>
                <Button
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  type="submit"
                  intent="primary"
                  icon="add"
                  text="Erstellen"
                />
              </td>
            </tr>
          </tfoot>
        </HTMLTable>
      </form>
    </div>
  );
}

export default InvoiceList;
