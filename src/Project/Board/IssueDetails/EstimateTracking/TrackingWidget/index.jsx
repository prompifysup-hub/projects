import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';

import { TrackingWidget, WatchIcon, Right, BarCont, Bar, Values } from './Styles';
import { TEXT } from 'config/text';

const propTypes = {
  issue: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsTrackingWidget = ({ issue }) => (
  <TrackingWidget>
    <WatchIcon type="stopwatch" size={26} top={-1} />
    <Right>
      <BarCont>
        <Bar width={calculateTrackingBarWidth(issue)} />
      </BarCont>
      <Values>
        <div>{issue.timeSpent ? TEXT.issue.logged(issue.timeSpent) : TEXT.issue.noTimeLogged}</div>
        {renderRemainingOrEstimate(issue)}
      </Values>
    </Right>
  </TrackingWidget>
);

const calculateTrackingBarWidth = ({ timeSpent, timeRemaining, estimate }) => {
  if (!timeSpent) {
    return 0;
  }
  if (isNil(timeRemaining) && isNil(estimate)) {
    return 100;
  }
  if (!isNil(timeRemaining)) {
    return (timeSpent / (timeSpent + timeRemaining)) * 100;
  }
  if (!isNil(estimate)) {
    return Math.min((timeSpent / estimate) * 100, 100);
  }
};

const renderRemainingOrEstimate = ({ timeRemaining, estimate }) => {
  if (isNil(timeRemaining) && isNil(estimate)) {
    return null;
  }
  if (!isNil(timeRemaining)) {
    return <div>{TEXT.issue.remaining(timeRemaining)}</div>;
  }
  if (!isNil(estimate)) {
    return <div>{TEXT.issue.estimated(estimate)}</div>;
  }
};

ProjectBoardIssueDetailsTrackingWidget.propTypes = propTypes;

export default ProjectBoardIssueDetailsTrackingWidget;
