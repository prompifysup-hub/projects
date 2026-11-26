import React from 'react';
import PropTypes from 'prop-types';

import { PRIORITIES } from 'config/app';

import { PriorityIcon } from './Styles';

const propTypes = {
  priority: PropTypes.string.isRequired,
};

const IssuePriorityIcon = ({ priority, ...otherProps }) => {
  const iconType = (PRIORITIES.find(p => p.value === priority) || {}).icon || 'arrow-up';

  return <PriorityIcon type={iconType} color={priority} size={18} {...otherProps} />;
};

IssuePriorityIcon.propTypes = propTypes;

export default IssuePriorityIcon;
