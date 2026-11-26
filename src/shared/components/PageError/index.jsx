import React from 'react';

import { ErrorPage, ErrorPageInner, ErrorBox, StyledIcon, Title, ReloadButton } from './Styles';
import { TEXT } from 'config/text';

const PageError = () => (
  <ErrorPage>
    <ErrorPageInner>
      <ErrorBox>
        <StyledIcon type="bug" />
        <Title>{TEXT.errors.pageTitle}</Title>
        <p>{TEXT.errors.pageMessage}</p>
        <ReloadButton variant="primary" onClick={() => window.location.reload()}>
          {TEXT.errors.reload}
        </ReloadButton>
      </ErrorBox>
    </ErrorPageInner>
  </ErrorPage>
);

export default PageError;
