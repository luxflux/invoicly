import React, { useState, useEffect } from 'react';
import { NumericInput, Button } from '@blueprintjs/core';

function InvoiceLineItem({ lineItem, products, showSkeleton, onChange, removeLineItem }) {
  const { productId, price, quantity } = lineItem;

  let product = {};
  if (products) {
    product = products.find(product => product.id === productId);
  }

  const currentProductTotal = price * quantity;

  return (
    <tr className="invoice-line-item">
      <td className="invoice-line-item__name">{product.name}</td>
      <td className="invoice-line-item__quantity">
        <NumericInput
          className={showSkeleton ? 'bp3-skeleton' : null}
          name="quantity"
          fill={true}
          onValueChange={quantity => onChange({ quantity })}
          value={quantity}
        />
      </td>
      <td className="invoice-line-item__price">
        <NumericInput
          className={showSkeleton ? 'bp3-skeleton' : null}
          name="price"
          fill={true}
          onValueChange={price => onChange({ price })}
          value={price}
        />
      </td>
      <td>{currentProductTotal}</td>
      <td>
        <Button icon="remove" minimal={true} intent="danger" onClick={removeLineItem} />
      </td>
    </tr>
  );
}

export default InvoiceLineItem;
