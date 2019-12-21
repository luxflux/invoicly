import React from 'react';
import { FormGroup, InputGroup, NumericInput } from '@blueprintjs/core';

export const TableTextInput = props => {
  const { className, type, name, placeholder, error, validations, register } = props;
  const hasError = !!error;
  const intent = hasError ? 'danger' : null;

  return (
    <FormGroup helperText={hasError && error.message} intent={intent}>
      <InputGroup
        className={className}
        type={type}
        name={name}
        placeholder={placeholder}
        fill={true}
        intent={intent}
        inputRef={register(validations)}
      />
    </FormGroup>
  );
};

export const TableNumberInput = props => {
  const { className, name, error, validations, register } = props;
  const hasError = !!error;
  const intent = hasError ? 'danger' : null;
  return (
    <FormGroup helperText={hasError && error.message} intent={intent}>
      <NumericInput
        className={className}
        name={name}
        fill={true}
        intent={intent}
        inputRef={register(validations)}
      />
    </FormGroup>
  );
};
