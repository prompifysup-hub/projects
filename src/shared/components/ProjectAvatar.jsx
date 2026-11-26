import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { color, font } from 'shared/utils/styles';

const propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
};

const defaultProps = {
  className: undefined,
  name: '',
  size: 40,
};

// The project's tile: its first letter on the brand colour.
const ProjectAvatar = ({ className, name, size }) => (
  <Tile className={className} size={size} aria-hidden="true">
    {(name.trim()[0] || 'P').toUpperCase()}
  </Tile>
);

const Tile = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: var(--radius, 3px);
  color: ${color.textOnPrimary};
  background: ${color.primary};
  ${font.bold}
  font-size: ${props => Math.round(props.size * 0.5)}px;
`;

ProjectAvatar.propTypes = propTypes;
ProjectAvatar.defaultProps = defaultProps;

export default ProjectAvatar;
