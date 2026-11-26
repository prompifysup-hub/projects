import styled, { css } from 'styled-components';

import { color, font } from 'shared/utils/styles';

export const Item = styled.div`
  display: flex;
  align-items: center;
  ${props =>
    props.isValue &&
    css`
      padding: 3px 4px 3px 0px;
      border-radius: var(--radius, 4px);
      &:hover,
      &:focus {
        background: ${color.backgroundLight};
      }
    `}
`;

export const Label = styled.div`
  padding: 0 3px 0 0;
  ${font.size(14.5)}
`;

export const EpicColor = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: var(--radius, 3px);
  background: ${props => props.color};
`;
