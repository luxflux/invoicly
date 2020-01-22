import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { H1, H2, HTMLTable, MenuItem, Button, Text } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { send } from './client-ipc';
import InvoiceLineItem from './InvoiceLineItem';
import Amount from './Amount';
import SettingsContext from './SettingsContext';

function InvoiceEdit() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [products, setProducts] = useState(null);
  const { settings: me } = useContext(SettingsContext);

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

  const removeLineItem = id => {
    send('remove-invoice-line-item', id).then(() => fetchInvoice(invoiceId));
  };

  const savePDF = () => {
    window.electronRemote.dialog
      .showSaveDialog(window.electronRemote.getCurrentWindow(), {
        defaultPath: `invoice-${invoice.number}.pdf`,
      })
      .then(({ filePath }) => {
        if (filePath.length) {
          window.ipcRenderer.send('save-invoice-pdf', filePath);
        }
      });
  };

  const customer = (invoice && invoice.customer) || {};

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
            <th className="price">Stückpreis</th>
            <th className="price">Total</th>
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
              <strong className="print-show">Total</strong>
              <span className="print-hide">
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
              </span>
            </td>
            <th className="price">{invoice && <Amount amount={invoice.total} />}</th>
          </tr>
        </tfoot>
      </HTMLTable>
      <Text tagName="p">
        Bankverbindung: {me.iban}, {me.name}, {me.street}, {me.zipCode} {me.city}
      </Text>
      <Button className="print-hide" icon="download" text="PDF speichern" onClick={savePDF} />
    </div>
  );
}

export default InvoiceEdit;
