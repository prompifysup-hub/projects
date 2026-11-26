import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'shared/components';
import { color } from 'shared/utils/styles';

import { NavLeft, LogoLink, StyledLogo, Item, ItemText } from './Styles';
import { TEXT } from 'config/text';

const propTypes = {
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
};

const ProjectNavbarLeft = ({ issueSearchModalOpen, issueCreateModalOpen }) => (
  <NavLeft>
    <LogoLink to="/">
      <StyledLogo color={color.textOnSecondary} />
    </LogoLink>

    <Item onClick={issueSearchModalOpen}>
      <Icon type="search" size={22} top={1} left={3} />
      <ItemText>{TEXT.nav.search}</ItemText>
    </Item>

    <Item onClick={issueCreateModalOpen}>
      <Icon type="plus" size={27} />
      <ItemText>{TEXT.nav.create}</ItemText>
    </Item>

  </NavLeft>
);

ProjectNavbarLeft.propTypes = propTypes;

export default ProjectNavbarLeft;
