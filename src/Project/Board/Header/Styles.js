import styled from 'styled-components';

import { color, font } from 'shared/utils/styles';

export const Header = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
`;

export const BoardName = styled.div`
  ${font.size(24)}
  ${font.heading}
`;

export const SprintInfo = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-left: 12px;
  }
`;

export const SprintText = styled.div`
  text-align: right;
  color: ${color.textMedium};
  ${font.size(13)}
  strong {
    display: block;
    color: ${color.textDark};
    ${font.medium}
    ${font.size(14.5)}
  }
`;
