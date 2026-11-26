import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

const defaultProps = {
  className: undefined,
  size: 28,
  color: 'currentColor',
};

// A neutral app mark (three board columns). Replace with the user's own logo if they have one.
const Logo = ({ className, size, color }) => (
  <span className={className}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
      <rect x="2" y="3" width="6.5" height="22" rx="2" fill={color} />
      <rect x="10.75" y="3" width="6.5" height="15" rx="2" fill={color} opacity="0.75" />
      <rect x="19.5" y="3" width="6.5" height="9" rx="2" fill={color} opacity="0.5" />
    </svg>
  </span>
);

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;

export default Logo;
