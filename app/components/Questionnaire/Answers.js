import React from 'react';
import PropTypes from 'prop-types';

import styled from '@datapunt/asc-core';
import { Label } from '@datapunt/asc-ui';

const StyledFooter = styled.div`
  margin-top: 20px;
`;

const Answers = ({
  className,
  answers,
  required,
  userAnswers,
  questionId,
  action,
  onChange,
  hideFooter,
  hasRegistry,
  setAnswer,
}) => {
  const userAnswer = (userAnswers && userAnswers[questionId]) || null;

  return (
    <>
      <div className={className}>
        {answers.map(answer => {
          // // Set answer based on previous user input
          // let backgroundColor = userAnswer && userAnswer === answer.value ? 'green' : '';
          // // Overwrite if registry answered question
          // if (hasRegistry) {
          //   backgroundColor =
          //     (setAnswer && answer.value === 'true') || (!setAnswer && answer.value === 'false') ? 'purple' : 'red';
          // }
          const checked =
            (userAnswer && userAnswer === answer.value) ||
            (hasRegistry && setAnswer && answer.value === 'true') ||
            (hasRegistry && !setAnswer && answer.value === 'false');

          // Check 'vergunningplichtig'
          // const requiredText = required === answer.optieText ? '*' : '';
          const answerId = `${questionId}-${answer.id}`;

          return (
            <Label htmlFor={answerId} key={answerId} label={answer.optieText}>
              <input
                key={answer.id}
                type="radio"
                id={answerId}
                name={questionId}
                answer-id={answer.id}
                value={answer.value}
                data-id={answer.id}
                style={{ marginRight: 10, height: 30 }}
                onChange={e => {
                  if (onChange) {
                    onChange(e);
                  }
                }}
                onClick={() => action && action(questionId, answer.value)}
                checked={checked}
                disabled="disabled"
              />
            </Label>
          );
        })}
      </div>
      {!hideFooter && required && <StyledFooter>* Vergunning nodig</StyledFooter>}
    </>
  );
};

const StyledAnswers = styled(Answers)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

Answers.propTypes = {
  className: PropTypes.string,
  required: PropTypes.string,
  answers: PropTypes.array,
  userAnswers: PropTypes.object,
  questionId: PropTypes.string,
  action: PropTypes.func,
  onChange: PropTypes.func,
  hideFooter: PropTypes.bool,
  hasRegistry: PropTypes.bool,
  setAnswer: PropTypes.bool,
};

export default StyledAnswers;