import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  // Button,
  TextField,
} from '@datapunt/asc-ui';
import { fetchStreetname, fetchBagData } from './actions';
import AddressInputResult from 'components/AddressInputResult';
import './style.scss';

class AddressInput extends React.Component {
  constructor(props) {
    super(props);
    this.onPostcodeInput = this.onPostcodeInput.bind(this);
    this.onStreetNumberInput = this.onStreetNumberInput.bind(this);
    this.state = {
      validPostcode: false,
      postcode: '',
      streetNumber: '',
      hasError: false,
      // debug: true,
    };
  }

  onPostcodeInput(event) {
    const { onFetchStreetname } = this.props;
    const { streetNumber } = this.state;
    const { value: postcode } = event.target;
    const regexPostcode = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
    const validPostcode = regexPostcode.test(postcode);
    const hasError = postcode.length > 5 && !validPostcode;

    if (streetNumber) {
      document.querySelector('.address-input__streetnumber').value = '';
      this.setState({
        streetNumber: false,
      });
    }

    this.setState({
      validPostcode,
      postcode,
      hasError,
    });

    if (validPostcode) {
      onFetchStreetname(postcode);
    }
  }

  onStreetNumberInput(event) {
    const { value: streetNumber } = event.target;

    this.setState({
      streetNumber,
    });

    const { onFetchBagData } = this.props;
    const { postcode, validPostcode } = this.state;

    if (postcode && streetNumber && validPostcode) {
      onFetchBagData(postcode, streetNumber);

      this.setState({
        hasError: false,
      });

      return;
    }

    this.setState({
      hasError: true,
    });
  }

  render() {
    const {
      streetName,
      streetNameLoading,
      bagLoading,
      bagFetch,
      bagStatus,
      monumentFetch,
      monumentStatus = '',
      monumentLoading,
      noResults,
    } = this.props;

    const { validPostcode, postcode, streetNumber, hasError, debug } = this.state;

    const {
      _display: fullAddress,
      _gemeente: { _display: gemeenteName },
      verblijfsobjectidentificatie,
    } = bagStatus;

    const loading = streetNameLoading || bagLoading;
    const notValidPostcodeAmsterdam = validPostcode && !streetName;
    const notValidAddress = bagFetch && !fullAddress;
    const showError = hasError || notValidPostcodeAmsterdam || notValidAddress;
    const notValidPostcode = !validPostcode || postcode.length !== 6;
    const notValidStreetNumber = !streetNumber;

    return (
      <div className="address-input">
        <h3>Vul de betreffende postcode en huisnummer in:</h3>
        <form className="address-input__form">
          <TextField
            className="address-input__input address-input__postcode"
            label="Postcode"
            onChange={this.onPostcodeInput}
            defaultValue={debug && '1055x'}
          />
          <TextField
            className="address-input__input address-input__streetnumber"
            label="Huisnummer + toevoeging"
            onInput={this.onStreetNumberInput}
            defaultValue={debug && '19'}
          />

          {!loading && showError && (
            <div className="address-input__error">
              {postcode && notValidPostcode && (
                <p>
                  De ingevoerde postcode is niet goed geformuleerd. Een postcode bestaat uit 4 cijfers en 2 letters.
                </p>
              )}
              {notValidPostcodeAmsterdam && (
                <p>De ingevoerde postcode is niet gevonden in de Amsterdamse database. Probeer opnieuw.</p>
              )}
              {!postcode && <p>Voer een postcode in</p>}
              {notValidStreetNumber && <p>Voer een huisnummer in</p>}

              {noResults && (
                <div>
                  <p className="address-input__feedback__incomplete">
                    Op de ingevoerde gegevens is geen adres gevonden.
                  </p>
                </div>
              )}
            </div>
          )}
        </form>

        {streetNumber && loading && (
          <AddressInputResult loading={loading} loadingText="De resultaten worden ingeladen." title="Laden..." />
        )}

        {validPostcode && fullAddress && !showError && (
          <>
            <AddressInputResult loading={streetNameLoading} title="Adres:">
              <div>{fullAddress}</div>
              <div>
                {postcode.toUpperCase()} {gemeenteName}
              </div>
            </AddressInputResult>

            <AddressInputResult loading={monumentLoading} title="Monument:">
              Status: {monumentStatus || 'Geen monument'}
            </AddressInputResult>

            <AddressInputResult loading={bagLoading} title="Beschermd stadsgezicht:">
              Status: {bagStatus.isUnesco ? `Ja, ${bagStatus.isUnesco}` : 'Nee'}
            </AddressInputResult>
          </>
        )}
      </div>
    );
  }
}

AddressInput.defaultProps = {
  bagStatus: {
    geometrie: {},
    verblijfsobjectidentificatie: '',
    _display: '',
    _gemeente: {
      _display: '',
    },
    isUnesco: '',
  },
  monumentStatus: '',
  noResults: false,
};

AddressInput.propTypes = {
  streetName: PropTypes.string,
  streetNameLoading: PropTypes.bool,
  bagLoading: PropTypes.bool,
  bagFetch: PropTypes.bool,
  bagStatus: PropTypes.shape({
    _display: PropTypes.string,
    verblijfsobjectidentificatie: PropTypes.string,
    geometrie: PropTypes.object,
    _gemeente: PropTypes.object,
    isUnesco: PropTypes.string, // @todo: remove from bagStatus and add to root
  }),
  monumentFetch: PropTypes.bool,
  monumentStatus: PropTypes.string,
  monumentLoading: PropTypes.bool,
  onFetchStreetname: PropTypes.func.isRequired,
  onFetchBagData: PropTypes.func.isRequired,
  noResults: PropTypes.bool,
};

const mapStateToProps = state => {
  const {
    streetNameLoading,
    streetName,
    bagFetch,
    bagLoading,
    bagStatus,
    monumentFetch,
    monumentLoading,
    monumentStatus,
    noResults,
  } = state.addressInput;
  return {
    streetNameLoading,
    streetName,
    bagFetch,
    bagLoading,
    bagStatus,
    monumentFetch,
    monumentLoading,
    monumentStatus,
    noResults,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onFetchBagData: fetchBagData,
      onFetchStreetname: fetchStreetname,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressInput);
