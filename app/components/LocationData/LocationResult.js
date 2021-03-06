import React from 'react';
import PropTypes from 'prop-types';

import { Paragraph } from '@datapunt/asc-ui';

const LocationResult = ({ title, loading, loadingText, children }) => (
  <>
    {title && (
      <Paragraph strong style={{ marginBottom: '0px' }}>
        {title}
      </Paragraph>
    )}
    {loading && <Paragraph>{loadingText}</Paragraph>}
    {children && !loading && children}
  </>
);

LocationResult.defaultProps = {
  loadingText: 'Laden...',
};

LocationResult.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  children: PropTypes.node,
};

export default LocationResult;
