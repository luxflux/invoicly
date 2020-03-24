import React, { useState, useEffect } from 'react';
import useForm from 'react-hook-form';
import { H1, Button, HTMLTable, ButtonGroup } from '@blueprintjs/core';

import { TableTextInput, TableNumberInput } from './TableInputs';
import Amount from './Amount';

import { send } from './client-ipc';

function ProductRow(props) {
  const { product } = props;

  let buttonProps = {};
  if (product.archived) {
    buttonProps = {
      intent: 'success',
      icon: 'unarchive',
      text: 'Aktivieren',
      onClick: props.setArchived,
    }
  } else {
    if (product.itemCount === 0) {
      buttonProps = {
        intent: 'danger',
        icon: 'delete',
        text: 'Löschen',
        onClick: props.remove,
      }
    } else {
      buttonProps = {
        intent: 'danger',
        icon: 'archive',
        text: 'Archivieren',
        onClick: props.setArchived,
      }
    }
  }

  return (
    <tr key={product.id}>
      <td>{product.name}</td>
      <td>
        <Amount amount={product.netPrice} />
      </td>
      <td>
        <Amount amount={product.grossPrice} />
      </td>
      <td>{product.itemCount}</td>
      <td>
      <Button
        small={true}
        {...buttonProps}
      />
      </td>
    </tr>
  );
}

function Products() {
  const [products, setProducts] = useState(null);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data, event) => {
    send('create-product', data).then(() => {
      fetchProducts();
      event.target.reset();
    });
  };

  const fetchProducts = () => {
    send('fetch-products').then(products => {
      setProducts(products);
    });
  };

  const setArchived = (id, archived) => {
    send('product-set-archived', { id, archived }).then(() => {
      fetchProducts();
    });
  };

  const remove = (id) => {
    send('remove-product', { id }).then(() => {
      fetchProducts();
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showSkeleton = !products;

  return (
    <div>
      <H1>Produkte</H1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HTMLTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Reseller Preis</th>
              <th>Kunden Preis</th>
              <th># Verwendet</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map(product => (
              <ProductRow
                product={product}
                setArchived={() => setArchived(product.id, !product.archived)}
                remove={() => remove(product.id)}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <TableTextInput
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  name="name"
                  placeholder="Name"
                  validations={{ required: 'benötigt' }}
                  error={errors.name}
                  register={register}
                />
              </td>
              <td>
                <TableNumberInput
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  name="netPrice"
                  validations={{ required: 'benötigt' }}
                  error={errors.netPrice}
                  register={register}
                />
              </td>
              <td>
                <TableNumberInput
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  name="grossPrice"
                  validations={{ required: 'benötigt' }}
                  error={errors.grossPrice}
                  register={register}
                />
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

export default Products;
