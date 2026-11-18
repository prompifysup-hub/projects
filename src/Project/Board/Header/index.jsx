import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';

import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { formatSprintDates } from 'shared/utils/sprints';
import { Button, ConfirmModal } from 'shared/components';

import { Header, BoardName, SprintInfo, SprintText } from './Styles';

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
      toast.success('Sprint completed. Unfinished issues moved to the backlog.');
      modal.close();
    } catch (error) {
      toast.error(error);
      modal.close();
    }
  };

  return (
    <Header>
      <BoardName>{activeSprint ? activeSprint.name : 'Kanban board'}</BoardName>
      {activeSprint ? (
        <SprintInfo>
          <SprintText>
            <strong>{activeSprint.goal || 'Active sprint'}</strong>
            {formatSprintDates(activeSprint)}
          </SprintText>
          <ConfirmModal
            title={`Complete ${activeSprint.name}?`}
            message="Done issues stay with this sprint. All other issues move back to the backlog."
            confirmText="Complete sprint"
            onConfirm={completeSprint}
            renderLink={modal => <Button onClick={modal.open}>Complete sprint</Button>}
          />
        </SprintInfo>
      ) : (
        <Link to={backlogUrl}>
          <Button icon="issues">Plan a sprint</Button>
        </Link>
      )}
    </Header>
  );
};

ProjectBoardHeader.propTypes = propTypes;
ProjectBoardHeader.defaultProps = defaultProps;

export default ProjectBoardHeader;
