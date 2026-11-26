import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { KeyCodes } from 'shared/constants/keyCodes';
import { isFocusedElementEditable } from 'shared/utils/browser';

import { Tip, TipLetter } from './Styles';
import { TEXT } from 'config/text';

const propTypes = {
  setFormOpen: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsCommentsCreateProTip = ({ setFormOpen }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (!isFocusedElementEditable() && event.keyCode === KeyCodes.M) {
        event.preventDefault();
        setFormOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setFormOpen]);

  return (
    <Tip>
      <strong>{TEXT.issue.proTip}</strong>
      {TEXT.issue.proTipPress}
      <TipLetter>M</TipLetter>
      {TEXT.issue.proTipAction}
    </Tip>
  );
};

ProjectBoardIssueDetailsCommentsCreateProTip.propTypes = propTypes;

export default ProjectBoardIssueDetailsCommentsCreateProTip;
