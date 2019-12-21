import React, { useState, useEffect } from 'react';
import { H1, H2 } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';

import { send } from './client-ipc';

function InvoiceEdit() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);

  const customer = (invoice && invoice.customer) || {};
  const me = {
    name: 'Melanie Schmid',
    street: 'Wasserfuristrasse 1',
    zipCode: '8542',
    city: 'Wiesendangen',
    country: 'Schweiz',
  };

  useEffect(() => {
    send('fetch-invoice', invoiceId).then(setInvoice);
  }, [invoiceId]);

  const showSkeleton = !invoice;
  const skeletonClass = (showSkeleton && 'bp3-skeleton') || '';

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
    </div>
  );
}

export default InvoiceEdit;
