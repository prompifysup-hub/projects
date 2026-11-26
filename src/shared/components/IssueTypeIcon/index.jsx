import React from 'react';
import PropTypes from 'prop-types';

import { ISSUE_TYPES } from 'config/app';

import { TypeIcon } from './Styles';

const propTypes = {
  type: PropTypes.string.isRequired,
};

const IssueTypeIcon = ({ type, ...otherProps }) => (
  <TypeIcon
    type={(ISSUE_TYPES.find(t => t.value === type) || {}).icon || 'task'}
    color={type}
    size={18}
    {...otherProps}
  />
);

IssueTypeIcon.propTypes = propTypes;

export default IssueTypeIcon;
