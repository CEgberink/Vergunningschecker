import React, { useContext } from 'react';
import { Paragraph, Heading } from '@datapunt/asc-ui';

import ReactMarkdown from 'react-markdown';
import history from 'utils/history';
import Form from 'components/Form/Form';
import Navigation from 'components/Navigation';
import { EXTERNAL_URLS, GET_CURRENT_TOPIC, PAGES } from '../../constants';
import { CheckerContext } from './CheckerContext';
import DebugDecisionTable from '../../components/Questionnaire/DebugDecisionTable';
import { connect } from 'react-redux';

const uniqueFilter = (value, index, self) => self.indexOf(value) === index;

const ConclusionsPage = () => {
  const { checker } = useContext(CheckerContext);

  const goToOLO = e => {
    e.preventDefault();
    if (addressResults?.length === 1) {
      // Form is validated, we can proceed

      // Generate OLO parameter "postalCode"
      const oloPostalCode = `facet_locatie_postcode=${addressResults[0].postcode}`;

      // Generate OLO parameter "streetNumber"
      const oloStreetNumber = `facet_locatie_huisnummer=${addressResults[0].huisnummer}`;

      // Generate OLO parameter "suffix"
      const oloSuffixValue = addressResults[0].toevoeging.replace(addressResults[0].huisnummer, '').trim();

      const oloSuffix = `facet_locatie_huisnummertoevoeging=${oloSuffixValue}`;

      // Redirect user to OLO with all parameters
      window.open(
        `${EXTERNAL_URLS.oloChecker.location}?param=postcodecheck&${oloPostalCode}&${oloStreetNumber}&${oloSuffix}`,
        '_blank',
      );
    }
  };

  return (
    <Form onSubmit={goToOLO}>
      <Heading $as="h1">Conclusie</Heading>

      <Paragraph>Op basis van uw antwoorden ....</Paragraph>

      {checker.permits.map(permit => {
        const conclusionString = permit.getOutputByDecisionId('dummy');
        const conclusion = permit.getDecisionById('dummy');
        const conclusionMatchingRules = conclusion.getMatchingRules();
        const displayConclusions = conclusionMatchingRules
          .filter(rule => rule.outputValue !== '"NeemContactOpMet"')
          .map(rule => rule.description)
          .filter(uniqueFilter);

        return (
          <div key={permit.name}>
            <Heading $as="h2">
              {permit.name}: {conclusionString}
            </Heading>
            {displayConclusions.map(text => (
              <div key={text}>
                <ReactMarkdown source={text} renderers={{ paragraph: Paragraph }} linkTarget="_blank" />
              </div>
            ))}
          </div>
        );
      })}

      <Navigation
        page={`checker-${PAGES.checkerConclusions}`}
        onGoToPrev={() => history.push(`/${GET_CURRENT_TOPIC()}/${PAGES.checkerResult}`)}
        showPrev
        showNext
        nextText="Naar het omgevingsloket"
        formEnds
      />
      <DebugDecisionTable checker={checker} />
    </Form>
  );
};

const mapStateToProps = state => {
  const { addressResultsLoading, addressResults, bagLoading } = state.locationData;
  return {
    addressResultsLoading,
    addressResults,
    bagLoading,
  };
};

export default connect(mapStateToProps)(ConclusionsPage);
