import React from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';

import { Content, Overview, Answers, PrefilledAnswerText } from 'components/Questionnaire';
import Navigation from 'components/Navigation';

// import config from './config';
import config from './demo-v2';

const StyledContent = styled(Content)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const StyledAnswers = styled(Answers)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RandomizeButton = props => (
  <button type="submit" onClick={props.randomizeAnswers()}>
    Randomize
  </button>
);
RandomizeButton.propTypes = {
  randomizeAnswers: PropTypes.func,
};

const CreateRoutesButton = props => (
  <button type="submit" onClick={props.createRoutes()}>
    Create routes
  </button>
);
CreateRoutesButton.propTypes = {
  createRoutes: PropTypes.func,
};

const Route = props => {
  const outcome = config.uitkomsten
    .filter(uitkomst => (areAllCondTrue(uitkomst.cond, props.route) ? uitkomst.label : false))
    .map(uitkomst => uitkomst.label);
  return (
    <StyledContent>
      <p>{outcome.length ? `Uitkomst: ${outcome}` : <strong>Deze route heeft geen uitkomst!</strong>}</p>
      <Overview userAnswers={props.route} uitvoeringsregels={config.uitvoeringsregels} />
      <br />
    </StyledContent>
  );
};
Route.propTypes = {
  route: PropTypes.object,
};

const getQuestionIdFromIndex = index => (config.uitvoeringsregels[index] ? config.uitvoeringsregels[index].id : null);

const condCheck = (cond, userAnswers) =>
  cond.some(condition =>
    // Check if condition has multiple conditions
    Array.isArray(condition) ? areAllCondTrue(condition, userAnswers) : isCondTrue(condition, userAnswers),
  );

const isCondTrue = (condition, userAnswers) => {
  // Check if one condition is true
  if (typeof condition === 'string') {
    // return cond.some(condition => {
    const conditionQuestion = condition.split('.')[0];
    const conditionAnswerText = condition
      .split('.')[1]
      .toLowerCase()
      .replace(/['"]+/g, '');

    const conditionQuestionData = config.uitvoeringsregels.filter(q => q.id === conditionQuestion);
    // if conditionQuestion exists is datafile && user has already answered
    if (conditionQuestionData.length === 1 && userAnswers[conditionQuestion]) {
      const userAnswerId = userAnswers[conditionQuestion];

      const userAnswer = conditionQuestionData[0].vraag.antwoordOpties
        .filter(antwoord => antwoord.id === userAnswerId)
        .map(antwoord => antwoord.optieText);
      const userAnswerText = userAnswer.toString().toLowerCase();
      // if conditionAnswer is the same as answeredQuestion
      return conditionAnswerText === userAnswerText;
    }
    return false;
  }
  return false;
};

const areAllCondTrue = (cond, userAnswers) =>
  // Check if multiple conditions are true
  cond.every(condition => {
    const conditionQuestion = condition.split('.')[0];
    const conditionAnswerText = condition
      .split('.')[1]
      .toLowerCase()
      .replace(/['"]+/g, '');

    const conditionQuestionData = config.uitvoeringsregels.filter(q => q.id === conditionQuestion);
    // if conditionQuestion exists is datafile && user has already answered
    if (conditionQuestionData.length === 1 && userAnswers[conditionQuestion]) {
      const userAnswerId = userAnswers[conditionQuestion];

      const userAnswer = conditionQuestionData[0].vraag.antwoordOpties
        .filter(antwoord => antwoord.id === userAnswerId)
        .map(antwoord => antwoord.optieText);
      const userAnswerText = userAnswer.toString().toLowerCase();
      // if conditionAnswer is the same as answeredQuestion
      return conditionAnswerText === userAnswerText;
    }
    return false;
  });

class QuestionnaireContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onGoToQuestion = this.onGoToQuestion.bind(this);
    this.onGoToNext = this.onGoToNext.bind(this);
    this.onGoToPrev = this.onGoToPrev.bind(this);
    this.onRandomizeAnswers = this.onRandomizeAnswers.bind(this);
    this.onCreateAllRoutes = this.onCreateAllRoutes.bind(this);

    this.state = {
      debug: {
        defaultLocation: 'de pijp',
      },
      location: false,
      questionIndex: -1,
      userAnswers: {},
      allRoutes: [],
    };
  }

  onGoToQuestion(questionId) {
    let questionIndex = 0;
    // Used for() instead of findIndex(), because of https://stackoverflow.com/a/15998003
    for (let i = 0; i < config.uitvoeringsregels.length; i += 1) {
      if (config.uitvoeringsregels[i].id === questionId) {
        questionIndex = i;
        break;
      }
    }
    this.setState({
      questionIndex,
    });
  }

  setLocation(location) {
    this.setState({
      location,
      questionIndex: 0,
    });
  }

  onGoToNext(questionId, answerId) {
    // const { userAnswers } = this.state;
    // console.log('userAnswers:');
    // console.log({
    //   ...userAnswers,
    //   [questionId]: answerId,
    // });
    this.setState(prevState => ({
      questionIndex: prevState.questionIndex + 1,
      userAnswers: {
        ...prevState.userAnswers,
        [questionId]: answerId,
      },
    }));
  }

  onGoToPrev() {
    const { questionIndex, userAnswers } = this.state;

    // Check if prev question exists
    if (getQuestionIdFromIndex(questionIndex - 1)) {
      for (let i = 1; i <= questionIndex; i += 1) {
        // Loop through answered questions until a question has been answered
        if (userAnswers[getQuestionIdFromIndex(questionIndex - i)]) {
          this.setState(prevState => ({
            questionIndex: prevState.questionIndex - i,
          }));
        }
      }
    }
  }

  onRandomizeAnswers() {
    const randomAnswers = config.uitvoeringsregels.reduce((o, key) => {
      const hasConditionAndFailed = key.cond && Array.isArray(key.cond) && !condCheck(key.cond, o);
      const value = !hasConditionAndFailed
        ? key.vraag.antwoordOpties[Math.floor(Math.random() * key.vraag.antwoordOpties.length)].id
        : null;
      return {
        ...o,
        [key.id]: value,
      };
    }, {});

    this.setLocation('de pijp');

    this.setState({
      questionIndex: config.uitvoeringsregels.length,
      userAnswers: {
        ...randomAnswers,
      },
    });
  }

  onCreateAllRoutes() {
    const { allRoutes } = this.state;

    for (let i = 0; i < 100; i += 1) {
      const randomAnswers = config.uitvoeringsregels.reduce((o, key) => {
        const hasConditionAndFailed = key.cond && Array.isArray(key.cond) && !condCheck(key.cond, o);
        const value = !hasConditionAndFailed
          ? key.vraag.antwoordOpties[Math.floor(Math.random() * key.vraag.antwoordOpties.length)].id
          : null;
        return {
          ...o,
          [key.id]: value,
        };
      }, {});

      const contains = allRoutes.some(elem => JSON.stringify(randomAnswers) === JSON.stringify(elem));

      if (!contains) {
        allRoutes.push(randomAnswers);
      }
    }

    this.setLocation('de pijp');

    this.setState({
      questionIndex: config.uitvoeringsregels.length,
      allRoutes,
    });
  }

  render() {
    const { questionIndex, userAnswers, location, debug, allRoutes } = this.state;

    if (debug) {
      // Debug > Set default location
      if (debug.defaultLocation && !location) {
        this.setLocation('de pijp');
      }
    }

    if (!location || questionIndex < 0) {
      // FIRST QUESTION: LOCATION
      return (
        <StyledContent heading="Waar wilt u uw aanbouw maken?">
          <h2>✓ De Pijp</h2>
          <p>Straks kunt u hier een locatie kiezen, nu wordt de vragenlijst van De Pijp laten zien.</p>
          <Navigation onGoToNext={() => this.setLocation('de pijp')} showNext />
          <RandomizeButton randomizeAnswers={() => this.onRandomizeAnswers} />
          <CreateRoutesButton createRoutes={() => this.onCreateAllRoutes} />
        </StyledContent>
      );
    }

    const { uitvoeringsregels } = config;

    if (uitvoeringsregels[questionIndex]) {
      // QUESTION FLOW FROM JSON
      const {
        id: questionId,
        vraag: { vraagTekst: question, antwoordOpties: answers, vergunningplichtig: required },
        // content: { toelichting: paragraph = 'demo' },
        cond,
      } = uitvoeringsregels[questionIndex];

      const paragraph = ''; // fake text

      // CONDITIONALS
      if (cond && Array.isArray(cond)) {
        // This question has condition(s)

        const isTrue = condCheck(cond, userAnswers);

        if (!isTrue) {
          // the conditions are not true, so skip this question
          this.onGoToNext(questionId, null);
        }
      }

      const hasPrefilledAnswer = answers.filter(answer => answer.prefilled).length > 0;

      return (
        <StyledContent headingDataId={questionId} heading={question} paragraph={paragraph}>
          {hasPrefilledAnswer && <PrefilledAnswerText />}
          <StyledAnswers
            questionId={questionId}
            userAnswers={userAnswers}
            answers={answers}
            required={required}
            onGoToNext={this.onGoToNext}
          />
          <Navigation showPrev onGoToPrev={this.onGoToPrev} showNext onGoToNext={this.onGoToNext} />
          <RandomizeButton randomizeAnswers={() => this.onRandomizeAnswers} />
          <CreateRoutesButton createRoutes={() => this.onCreateAllRoutes} />
        </StyledContent>
      );
    }

    if (allRoutes && allRoutes.length > 0) {
      // ALL ROUTES OVERVIEW
      return allRoutes.map(route => <Route route={route} key={route} />);
    }

    if (questionIndex >= uitvoeringsregels.length) {
      // OVERVIEW
      return (
        <StyledContent heading="Controleer uw antwoorden">
          <p>
            Uitkomst:{' '}
            <strong>
              {config.uitkomsten.map(uitkomst => (areAllCondTrue(uitkomst.cond, userAnswers) ? uitkomst.label : null))}
            </strong>
          </p>
          <p>
            Hieronder ziet u uw antwoorden terug. U kunt uw antwoorden eenvoudig wijzigen. Als u op volgende klikt, ziet
            u wat de vervolgstappen zijn.
          </p>
          <Overview
            onGoToQuestion={this.onGoToQuestion}
            userAnswers={userAnswers}
            uitvoeringsregels={uitvoeringsregels}
          />
          <Navigation />
          <RandomizeButton randomizeAnswers={() => this.onRandomizeAnswers} />
          <CreateRoutesButton createRoutes={() => this.onCreateAllRoutes} />
        </StyledContent>
      );
    }

    return null;
  }
}

export default QuestionnaireContainer;
