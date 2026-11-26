import React, { useState } from 'react';

import { copyToClipboard } from 'shared/utils/browser';
import { Button } from 'shared/components';
import { TEXT } from 'config/text';

const CopyLinkButton = ({ ...buttonProps }) => {
  const [isLinkCopied, setLinkCopied] = useState(false);

  const handleLinkCopy = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    copyToClipboard(window.location.href);
  };

  return (
    <Button icon="link" onClick={handleLinkCopy} {...buttonProps}>
      {isLinkCopied ? TEXT.issue.linkCopied : TEXT.issue.copyLink}
    </Button>
  );
};

export default CopyLinkButton;
