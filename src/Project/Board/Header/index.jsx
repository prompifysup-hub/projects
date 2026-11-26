import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';

import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { formatSprintDates } from 'shared/utils/sprints';
import { Button, ConfirmModal } from 'shared/components';

import { Header, BoardName, SprintInfo, SprintText } from './Styles';
import { TEXT } from 'config/text';
import { FEATURES } from 'config/app';

const propTypes = {
  activeSprint: PropTypes.object,
  fetchProject: PropTypes.func.isRequired,
};

const defaultProps = {
  activeSprint: null,
};

const ProjectBoardHeader = ({ activeSprint, fetchProject }) => {
  const match = useRouteMatch();
  const backlogUrl = match.url.replace(/\/board.*$/, '/backlog');

  const completeSprint = async modal => {
    try {
      await api.post(`/sprints/${activeSprint.id}/complete`);
      await fetchProject();
      toast.success(TEXT.sprint.completed);
      modal.close();
    } catch (error) {
      toast.error(error);
      modal.close();
    }
  };

  return (
    <Header>
      <BoardName>{activeSprint ? activeSprint.name : TEXT.board.title}</BoardName>
      {activeSprint ? (
        <SprintInfo>
          <SprintText>
            <strong>{activeSprint.goal || TEXT.board.activeSprint}</strong>
            {formatSprintDates(activeSprint)}
          </SprintText>
          <ConfirmModal
            title={TEXT.sprint.completeTitle(activeSprint.name)}
            message={TEXT.sprint.completeMessage}
            confirmText={TEXT.sprint.complete}
            onConfirm={completeSprint}
            renderLink={modal => <Button onClick={modal.open}>{TEXT.sprint.complete}</Button>}
          />
        </SprintInfo>
      ) : (
        FEATURES.sprints && (
          <Link to={backlogUrl}>
            <Button icon="issues">{TEXT.board.planSprint}</Button>
          </Link>
        )
      )}
    </Header>
  );
};

ProjectBoardHeader.propTypes = propTypes;
ProjectBoardHeader.defaultProps = defaultProps;

export default ProjectBoardHeader;
