import styled from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';
import Icon from 'shared/components/Icon';
import Button from 'shared/components/Button';

export const ErrorPage = styled.div`
  padding: 64px;
`;

export const ErrorPageInner = styled.div`
  margin: 0 auto;
  max-width: 1440px;
  padding: 120px 0;
`;

export const ErrorBox = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 480px;
  padding: 32px;
  border-radius: var(--radius, 3px);
  border: 1px solid ${color.borderLight};
  ${mixin.boxShadowMedium}
  background: ${color.backgroundWhite};
`;

export const ReloadButton = styled(Button)`
  margin-top: 24px;
`;

export const StyledIcon = styled(Icon)`
  position: absolute;
  top: 32px;
  left: 32px;
  font-size: 30px;
  color: ${color.primary};
`;

export const Title = styled.h1`
  margin-bottom: 16px;
  padding-left: 42px;
  ${font.size(29)}
`;
