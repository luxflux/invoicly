import React, { useContext } from 'react';
import { H1, FormGroup, InputGroup } from '@blueprintjs/core';

import SettingsContext from './SettingsContext';

function Settings() {
  const {
    settings: { name, street, zipCode, city, country, iban },
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
          street="street"
          fill={true}
          onChange={event => updateSetting('street', event.target.value)}
          value={street}
        />
      </FormGroup>

      <FormGroup label="PLZ" labelFor="zipCode">
        <InputGroup
          zipCode="zipCode"
          fill={true}
          onChange={event => updateSetting('zipCode', event.target.value)}
          value={zipCode}
        />
      </FormGroup>

      <FormGroup label="Stadt" labelFor="city">
        <InputGroup
          city="city"
          fill={true}
          onChange={event => updateSetting('city', event.target.value)}
          value={city}
        />
      </FormGroup>

      <FormGroup label="Land" labelFor="country">
        <InputGroup
          country="country"
          fill={true}
          onChange={event => updateSetting('country', event.target.value)}
          value={country}
        />
      </FormGroup>

      <FormGroup label="IBAN" labelFor="iban">
        <InputGroup
          iban="iban"
          fill={true}
          onChange={event => updateSetting('iban', event.target.value)}
          value={iban}
        />
      </FormGroup>
    </div>
  );
}

export default Settings;
