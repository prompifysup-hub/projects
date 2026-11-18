import styled, { css } from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';

export const Header = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  ${font.size(24)}
  ${font.medium}
`;

export const Section = styled.div`
  margin-top: 24px;
  padding: 6px 6px 8px;
  border-radius: 3px;
  background: ${color.backgroundLightest};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 0 6px 0 4px;
`;

export const Toggle = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  ${mixin.clickable}
  i {
    margin-right: 6px;
    font-size: 20px;
    color: ${color.textMedium};
  }
`;

export const SectionName = styled.div`
  color: ${color.textDarkest};
  ${font.bold}
  ${font.size(15)}
`;

export const SectionMeta = styled.div`
  margin-left: 10px;
  color: ${color.textMedium};
  ${font.size(13)}
  ${mixin.truncateText}
`;

export const SectionActions = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-left: 6px;
  }
`;

export const Points = styled.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 11px;
  color: ${color.textDark};
  background: ${color.backgroundMedium};
  ${font.bold}
  ${font.size(12)}
`;

export const Goal = styled.div`
  padding: 0 10px 8px 30px;
  color: ${color.textMedium};
  ${font.size(13.5)}
`;

export const Issues = styled.div`
  min-height: 44px;
  border-radius: 3px;
  background: ${props => (props.isDraggingOver ? color.backgroundLightPrimary : 'transparent')};
  transition: background 0.1s;
`;

export const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  margin: 0 4px;
  border: 1px dashed ${color.borderLight};
  border-radius: 3px;
  color: ${color.textMedium};
  ${font.size(13.5)}
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid ${color.borderLightest};
  ${mixin.clickable}
  &:first-child {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  &:hover {
    background: ${color.backgroundLight};
  }
  ${props =>
    props.isDragging &&
    css`
      border-radius: 3px;
      ${mixin.boxShadowMedium}
    `}
  & > * + * {
    margin-left: 12px;
  }
`;

export const RowTitle = styled.div`
  flex: 1;
  min-width: 0;
  color: ${color.textDarkest};
  ${font.size(14.5)}
  ${mixin.truncateText}
  ${props => props.isDone && `text-decoration: line-through; color: ${color.textMedium};`}
`;

export const EpicTag = styled.span`
  ${props => mixin.tag(mixin.rgba(props.color, 0.18), mixin.darken(props.color, 0.35))}
  max-width: 180px;
  cursor: inherit;
  span {
    ${mixin.truncateText}
  }
`;

export const StatusTag = styled.span`
  ${props => mixin.tag(props.background, props.textColor)}
  text-transform: uppercase;
  cursor: inherit;
  ${font.size(11.5)}
`;

export const Assignees = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-left: 10px;
  & > * {
    margin-left: -4px;
    box-shadow: 0 0 0 2px #fff;
  }
`;

export const CreateLink = styled.div`
  display: flex;
  align-items: center;
  margin-top: 6px;
  padding: 8px 8px;
  border-radius: 3px;
  color: ${color.textMedium};
  ${font.size(14.5)}
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLight};
    color: ${color.textDark};
  }
  i {
    margin-right: 6px;
  }
`;

export const CreateForm = styled.form`
  margin-top: 6px;
`;
