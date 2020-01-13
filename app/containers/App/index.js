import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { Row, Column, themeColor, themeSpacing } from '@datapunt/asc-ui';
import styled from '@datapunt/asc-core';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import { useInjectSaga } from 'utils/injectSaga';
import LocationPage from 'containers/LocationPage';
import Header from 'components/Header';
import Footer from 'components/Footer';
import GlobalError from 'containers/GlobalError';
import { GET_TEXT, EXTERNAL_URLS, PAGES } from '../../constants';
import questionnaireSaga from '../QuestionnaireContainer/saga';
import locationSaga from '../LocationPage/saga';
import './style.scss';

const addressInputKey = 'location';
const questionnaireKey = 'questionnaire';

const Container = styled(`div`)`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  background-color: white;
`;
const ContentContainer = styled(`div`)`
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  background-color: white;
`;
const FormTitle = styled(`h4`)`
  margin: ${themeSpacing(6, 0)};
  padding-bottom: 6px;
  border-bottom: 1px solid ${themeColor('tint', 'level5')};
  color: ${themeColor('tint', 'level5')};
`;
const Content = styled(`div`)`
  display: block;
  width: 100%;
`;

export const App = props => {
  useInjectSaga({ key: addressInputKey, saga: locationSaga });
  useInjectSaga({ key: questionnaireKey, saga: questionnaireSaga });

  const currentRoute = props.location.pathname.split('/')[1];
  const { trackPageView } = useMatomo();

  // @datapunt Track Page View
  // Docu: https://github.com/Amsterdam/matomo-tracker/tree/master/packages/react
  React.useEffect(() => {
    trackPageView();
  }, [currentRoute]);

  return (
    <Container>
      <GlobalError />
      <Header />
      <ContentContainer>
        <Row>
          <Column
            wrap
            span={{
              small: 1,
              medium: 2,
              big: 5,
              large: 9,
              xLarge: 9,
            }}
          >
            <Content />
            <Content>
              <FormTitle>{GET_TEXT?.title}</FormTitle>
            </Content>
            <Switch>
              <Route exact path="/" component={Content} />
              <Route exact path={`/:activityGroup/${PAGES.location}`} component={LocationPage} />
              <Route exact path="/health" />
              <Route
                path=""
                component={() => {
                  window.location.href = EXTERNAL_URLS.oloChecker.intro;
                  return null;
                }}
              />
            </Switch>
          </Column>
        </Row>
      </ContentContainer>
      <Footer />
    </Container>
  );
};

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default withRouter(compose(memo)(App));
