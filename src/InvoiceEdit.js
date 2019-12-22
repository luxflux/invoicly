import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { H1, H2, HTMLTable, MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { send } from './client-ipc';
import InvoiceLineItem from './InvoiceLineItem';

function InvoiceEdit() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [products, setProducts] = useState(null);

  const createLineItem = product => {
    const data = {
      productId: product.id,
      invoiceId,
      quantity: 1,
      price: product.grossPrice,
    };
    send('create-invoice-line-item', data).then(() => fetchInvoice(invoiceId));
  };

  const fetchInvoice = id => {
    send('fetch-invoice', id).then(setInvoice);
  };

  const updateLineItem = (id, data) => {
    send('update-invoice-line-item', { id, data }).then(() => fetchInvoice(invoiceId));
  };

  const removeLineItem = (id) => {
    send('remove-invoice-line-item', id).then(() => fetchInvoice(invoiceId));
  };

  const customer = (invoice && invoice.customer) || {};
  const me = {
    name: 'Melanie Schmid',
    street: 'Wasserfuristrasse 1',
    zipCode: '8542',
    city: 'Wiesendangen',
    country: 'Schweiz',
  };

  useEffect(() => {
    fetchInvoice(invoiceId);
    send('fetch-products').then(setProducts);
  }, [invoiceId]);

  const showSkeleton = !invoice;
  const skeletonClass = (showSkeleton && 'bp3-skeleton') || '';
  const lineItems = (invoice && invoice.lineItems) || [];

  return (
    <div>
      <H1>Rechnung {invoice && invoice.number}</H1>
      <div className="invoice-edit__addresses">
        <div className="invoice-edit__customer">
          <p className={skeletonClass}>
            {customer.name}
            <br />
            {customer.street}
            <br />
            {customer.zipCode} {customer.city}
            <br />
            {customer.country}
          </p>
        </div>

        <div className="invoice-edit__me">
          <p className={skeletonClass}>
            {me.name}
            <br />
            {me.street}
            <br />
            {me.zipCode} {customer.city}
            <br />
            {me.country}
          </p>
        </div>
      </div>

      <H2>Artikel</H2>

      <HTMLTable>
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Anzahl</th>
            <th>Stückpreis</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map(lineItem => (
            <InvoiceLineItem
              key={lineItem.id}
              showSkeleton={showSkeleton}
              lineItem={lineItem}
              products={products}
              onChange={data => updateLineItem(lineItem.id, data)}
              removeLineItem={() => removeLineItem(lineItem.id)}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">
              <Select
                className={showSkeleton ? 'bp3-skeleton' : null}
                items={products || []}
                itemRenderer={(product, { handleClick }) => (
                  <MenuItem key={product.id} onClick={handleClick} text={product.name} />
                )}
                onItemSelect={createLineItem}
                noResults={<MenuItem disabled={true} text="No results." />}
              >
                <Button
                  text="Neues Produkt hinzufügen"
                  rightIcon="double-caret-vertical"
                  fill={true}
                />
              </Select>
            </td>
            <th>
              {invoice && invoice.total}
            </th>
          </tr>
        </tfoot>
      </HTMLTable>
    </div>
  );
}

export default InvoiceEdit;
