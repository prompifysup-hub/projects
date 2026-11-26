import React from 'react';
import PropTypes from 'prop-types';

import { formatDateTimeConversational } from 'shared/utils/dateTime';

import { Dates } from './Styles';
import { TEXT } from 'config/text';

const propTypes = {
  issue: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsDates = ({ issue }) => (
  <Dates>
    <div>{TEXT.issue.created(formatDateTimeConversational(issue.createdAt))}</div>
    <div>{TEXT.issue.updated(formatDateTimeConversational(issue.updatedAt))}</div>
  </Dates>
);

ProjectBoardIssueDetailsDates.propTypes = propTypes;

export default ProjectBoardIssueDetailsDates;
