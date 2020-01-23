import React, { useContext } from 'react';
import { H1, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';

import SettingsContext from './SettingsContext';

function Settings() {
  const {
    settings: { name, street, zipCode, city, country, iban, invoiceText },
    updateSettings,
  } = useContext(SettingsContext);

  const updateSetting = (setting, value) => {
    updateSettings({ [setting]: value });
  };

  return (
    <div>
      <H1>Einstellungen</H1>
      <FormGroup label="Name" labelFor="name">
        <InputGroup
          name="name"
          fill={true}
          onChange={event => updateSetting('name', event.target.value)}
          value={name}
        />
      </FormGroup>

      <FormGroup label="Strasse" labelFor="street">
        <InputGroup
          name="street"
          fill={true}
          onChange={event => updateSetting('street', event.target.value)}
          value={street}
        />
      </FormGroup>

      <FormGroup label="PLZ" labelFor="zipCode">
        <InputGroup
          name="zipCode"
          fill={true}
          onChange={event => updateSetting('zipCode', event.target.value)}
          value={zipCode}
        />
      </FormGroup>

      <FormGroup label="Stadt" labelFor="city">
        <InputGroup
          name="city"
          fill={true}
          onChange={event => updateSetting('city', event.target.value)}
          value={city}
        />
      </FormGroup>

      <FormGroup label="Land" labelFor="country">
        <InputGroup
          name="country"
          fill={true}
          onChange={event => updateSetting('country', event.target.value)}
          value={country}
        />
      </FormGroup>

      <FormGroup label="IBAN" labelFor="iban">
        <InputGroup
          name="iban"
          fill={true}
          onChange={event => updateSetting('iban', event.target.value)}
          value={iban}
        />
      </FormGroup>

      <FormGroup label="Rechnungs Text" labelFor="iban">
        <TextArea
          name="invoiceText"
          fill={true}
          onChange={event => updateSetting('invoiceText', event.target.value)}
          value={invoiceText}
        />
      </FormGroup>
    </div>
  );
}

export default Settings;
