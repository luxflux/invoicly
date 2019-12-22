import React from 'react';
import { NumericInput, Button } from '@blueprintjs/core';

import Amount from './Amount';

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
        <span className="print-show">{quantity}</span>
        <span className="print-hide">
          <NumericInput
            className={showSkeleton ? 'bp3-skeleton' : null}
            name="quantity"
            fill={true}
            onValueChange={quantity => onChange({ quantity })}
            value={quantity}
          />
        </span>
      </td>
      <td className="price invoice-line-item__price">
        <span className="print-show">
          <Amount amount={price} />
        </span>
        <span className="print-hide">
          <NumericInput
            className={showSkeleton ? 'bp3-skeleton' : null}
            name="price"
            fill={true}
            onValueChange={price => onChange({ price })}
            value={price}
          />
        </span>
      </td>
      <td className="price">
        <Amount amount={currentProductTotal} />
      </td>
      <td className="price">
        <Button
          className="print-hide"
          icon="remove"
          minimal={true}
          intent="danger"
          onClick={removeLineItem}
        />
      </td>
    </tr>
  );
}

export default InvoiceLineItem;
