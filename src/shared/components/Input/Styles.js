import styled, { css } from 'styled-components';

import { color, font } from 'shared/utils/styles';
import Icon from 'shared/components/Icon';

export const StyledInput = styled.div`
  position: relative;
  display: inline-block;
  height: calc(20px + 2 * var(--control-padding-y, 6px));
  width: 100%;
`;

export const InputElement = styled.input`
  height: 100%;
  width: 100%;
  padding: 0 var(--control-padding-x, 7px);
  border-radius: var(--radius, 3px);
  border: 1px solid ${color.borderLightest};
  color: ${color.textDarkest};
  background: ${color.backgroundLightest};
  transition: background 0.1s;
  ${font.regular}
  ${font.size(15)}
  ${props => props.hasIcon && 'padding-left: calc(var(--control-padding-x, 7px) + 25px);'}
  &:hover {
    background: ${color.backgroundLight};
  }
  &:focus {
    background: ${color.backgroundWhite};
    border: 1px solid ${color.borderInputFocus};
    box-shadow: 0 0 0 1px ${color.borderInputFocus};
  }
  ${props =>
    props.invalid &&
    css`
      &,
      &:focus {
        border: 1px solid ${color.danger};
        box-shadow: none;
      }
    `}
`;

export const StyledIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: calc(var(--control-padding-x, 7px) + 1px);
  pointer-events: none;
  color: ${color.textMedium};
`;
