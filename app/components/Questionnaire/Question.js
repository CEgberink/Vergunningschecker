import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Heading } from '@datapunt/asc-ui';

import Form from 'components/Form/Form';

const Question = ({ className, heading, headingDataId, paragraph, children, ...otherProps }) => (
  <Form className={className} {...otherProps}>
    {heading && (
      <Heading $as="h3" data-id={headingDataId}>
        {heading}
      </Heading>
    )}
    {paragraph && <ReactMarkdown source={paragraph} />}
    {children}
  </Form>
);

Question.defaultProps = {
  paragraph: null,
};

Question.propTypes = {
  className: PropTypes.string,
  heading: PropTypes.string,
  headingDataId: PropTypes.string,
  paragraph: PropTypes.string,
  children: PropTypes.any,
};

export default Question;
