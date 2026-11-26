import styled, { css } from 'styled-components';

import { color, font } from 'shared/utils/styles';

export const StyledTextarea = styled.div`
  display: inline-block;
  width: 100%;
  textarea {
    overflow-y: hidden;
    width: 100%;
    padding: calc(var(--control-padding-y, 6px) + 2px) calc(var(--control-padding-x, 7px) + 5px);
    border-radius: var(--radius, 3px);
    border: 1px solid ${color.borderLightest};
    color: ${color.textDarkest};
    background: ${color.backgroundLightest};
    ${font.regular}
    ${font.size(15)}
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
        }
      `}
  }
`;
