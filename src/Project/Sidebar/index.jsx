import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useRouteMatch } from 'react-router-dom';

import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Icon, ProjectAvatar } from 'shared/components';

import {
  Sidebar,
  ProjectInfo,
  ProjectTexts,
  ProjectName,
  ProjectCategory,
  Divider,
  LinkItem,
  LinkText,
} from './Styles';
import { TEXT } from 'config/text';
import { FEATURES } from 'config/app';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectSidebar = ({ project }) => {
  const match = useRouteMatch();

  return (
    <Sidebar>
      <ProjectInfo>
        <ProjectAvatar name={project.name} />
        <ProjectTexts>
          <ProjectName>{project.name}</ProjectName>
          <ProjectCategory>{TEXT.nav.category(ProjectCategoryCopy[project.category] || '')}</ProjectCategory>
        </ProjectTexts>
      </ProjectInfo>

      {renderLinkItem(match, TEXT.nav.board, 'board', '/board')}
      {FEATURES.sprints && renderLinkItem(match, TEXT.nav.backlog, 'issues', '/backlog')}
      {FEATURES.roadmap && renderLinkItem(match, TEXT.nav.roadmap, 'calendar', '/roadmap')}
      <Divider />
      {renderLinkItem(match, TEXT.nav.settings, 'settings', '/settings')}
    </Sidebar>
  );
};

const renderLinkItem = (match, text, iconType, path) => (
  <LinkItem as={NavLink} exact to={`${match.path}${path}`}>
    <Icon type={iconType} />
    <LinkText>{text}</LinkText>
  </LinkItem>
);

ProjectSidebar.propTypes = propTypes;

export default ProjectSidebar;
