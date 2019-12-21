import React, { useState, useEffect } from 'react';
import useForm from 'react-hook-form';
import { H1, Button, HTMLTable } from '@blueprintjs/core';

import { TableTextInput } from './TableInputs';

import { send } from './client-ipc';

function Customers() {
  const [customers, setCustomers] = useState(null);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data, event) => {
    send('create-customer', data).then(() => {
      fetchCustomers();
      event.target.reset();
    });
  };

  const fetchCustomers = () => {
    send('fetch-customers').then(customers => {
      setCustomers(customers);
    });
  };

  const setArchived = (id, archived) => {
    send('customer-set-archived', { id, archived }).then(() => {
      fetchCustomers();
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const showSkeleton = !customers;

  return (
    <div>
      <H1>Kunden</H1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HTMLTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Strasse</th>
              <th>PLZ</th>
              <th>Ort</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {(customers || []).map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.street}</td>
                <td>{customer.zipCode}</td>
                <td>{customer.city}</td>
                <td>{customer.country}</td>
                <td>
                  <Button
                    intent={customer.archived ? 'success' : 'danger'}
                    icon={customer.archived ? 'unarchive' : 'archive'}
                    text={customer.archived ? 'Aktivieren' : 'Archivieren'}
                    small={true}
                    onClick={() => setArchived(customer.id, !customer.archived)}
                  />
                </td>
              </tr>
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
                <TableTextInput
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  name="street"
                  placeholder="Strasse"
                  validations={{ required: 'benötigt' }}
                  error={errors.street}
                  register={register}
                />
              </td>
              <td>
                <TableTextInput
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  name="zipCode"
                  placeholder="PLZ"
                  validations={{ required: 'benötigt' }}
                  error={errors.zipCode}
                  register={register}
                />
              </td>
              <td>
                <TableTextInput
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  name="city"
                  placeholder="Stadt"
                  validations={{ required: 'benötigt' }}
                  error={errors.zipCode}
                  register={register}
                />
              </td>
              <td>
                <TableTextInput
                  className={showSkeleton ? 'bp3-skeleton' : null}
                  name="country"
                  placeholder="Land"
                  validations={{ required: 'benötigt' }}
                  error={errors.country}
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

export default Customers;
