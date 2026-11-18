import React from 'react';
import PropTypes from 'prop-types';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';

import { Modal } from 'shared/components';

import IssueDetails from './Board/IssueDetails';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

/** Opens the issue panel at <page>/issues/:issueId, as the board does. */
const IssueDetailsRoute = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const match = useRouteMatch();
  const history = useHistory();

  return (
    <Route
      path={`${match.path}/issues/:issueId`}
      render={routeProps => (
        <Modal
          isOpen
          testid="modal:issue-details"
          width={1040}
          withCloseIcon={false}
          onClose={() => history.push(match.url)}
          renderContent={modal => (
            <IssueDetails
              issueId={routeProps.match.params.issueId}
              projectUsers={project.users}
              projectSprints={project.sprints}
              projectEpics={project.epics}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
              modalClose={modal.close}
            />
          )}
        />
      )}
    />
  );
};

IssueDetailsRoute.propTypes = propTypes;

export default IssueDetailsRoute;
