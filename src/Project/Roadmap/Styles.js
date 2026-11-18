import styled, { css } from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';

export const ROW_HEIGHT = 44;
export const CHILD_HEIGHT = 36;
export const HEADER_HEIGHT = 56;
export const LEFT_WIDTH = 320;

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

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 12px;
  }
`;

export const Zoom = styled.div`
  display: inline-flex;
  & > button {
    border-radius: 0;
  }
  & > button:first-child {
    border-radius: 3px 0 0 3px;
  }
  & > button:last-child {
    border-radius: 0 3px 3px 0;
  }
`;

export const Chart = styled.div`
  display: flex;
  margin-top: 24px;
  border: 1px solid ${color.borderLightest};
  border-radius: 3px;
  background: #fff;
`;

export const Left = styled.div`
  flex: 0 0 ${LEFT_WIDTH}px;
  border-right: 1px solid ${color.borderLightest};
`;

export const LeftHeader = styled.div`
  display: flex;
  align-items: flex-end;
  height: ${HEADER_HEIGHT}px;
  padding: 0 14px 10px;
  border-bottom: 1px solid ${color.borderLightest};
  color: ${color.textMedium};
  text-transform: uppercase;
  ${font.bold}
  ${font.size(12)}
`;

export const EpicRow = styled.div`
  display: flex;
  align-items: center;
  height: ${ROW_HEIGHT}px;
  padding: 0 10px 0 6px;
  border-bottom: 1px solid ${color.borderLightest};
`;

export const Chevron = styled.div`
  display: flex;
  width: 22px;
  justify-content: center;
  color: ${color.textMedium};
  ${props => (props.isEmpty ? 'visibility: hidden;' : mixin.clickable)}
  i {
    font-size: 18px;
  }
`;

export const EpicSquare = styled.span`
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  margin: 0 10px 0 4px;
  border-radius: 3px;
  background: ${props => props.color};
`;

export const EpicTitle = styled.div`
  flex: 1;
  min-width: 0;
  color: ${color.textDarkest};
  ${font.medium}
  ${font.size(14.5)}
  ${mixin.truncateText}
  ${mixin.clickable}
  &:hover {
    color: ${color.textLink};
    text-decoration: underline;
  }
`;

export const Progress = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  color: ${color.textMedium};
  ${font.size(12)}
`;

export const ProgressBar = styled.div`
  width: 48px;
  height: 6px;
  margin-right: 6px;
  border-radius: 3px;
  overflow: hidden;
  background: ${color.backgroundMedium};
  div {
    height: 100%;
    width: ${props => props.percent}%;
    background: ${color.success};
  }
`;

export const ChildRow = styled.div`
  display: flex;
  align-items: center;
  height: ${CHILD_HEIGHT}px;
  padding: 0 10px 0 44px;
  border-bottom: 1px solid ${color.borderLightest};
  background: ${color.backgroundLightest};
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLight};
  }
  & > * + * {
    margin-left: 8px;
  }
`;

export const ChildTitle = styled.div`
  flex: 1;
  min-width: 0;
  color: ${color.textDark};
  ${font.size(13.5)}
  ${mixin.truncateText}
  ${props => props.isDone && `text-decoration: line-through; color: ${color.textMedium};`}
`;

export const StatusDot = styled.span`
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
`;

export const CreateEpic = styled.div`
  display: flex;
  align-items: center;
  height: ${ROW_HEIGHT}px;
  padding: 0 14px;
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

export const Right = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  ${mixin.customScrollbar({ width: 8 })}
  &::-webkit-scrollbar {
    height: 10px;
  }
`;

export const Canvas = styled.div`
  position: relative;
  width: ${props => props.width}px;
`;

export const TimeHeader = styled.div`
  position: relative;
  height: ${HEADER_HEIGHT}px;
  border-bottom: 1px solid ${color.borderLightest};
`;

export const MonthLabel = styled.div`
  position: absolute;
  top: 10px;
  padding-left: 8px;
  color: ${color.textDark};
  white-space: nowrap;
  ${font.medium}
  ${font.size(13)}
`;

export const WeekLabel = styled.div`
  position: absolute;
  top: 32px;
  padding-left: 6px;
  color: ${color.textMedium};
  white-space: nowrap;
  ${font.size(12)}
`;

export const GridLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: ${props => (props.strong ? color.borderLightest : color.backgroundLight)};
`;

export const TodayLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: ${color.primary};
  z-index: 2;
  &:before {
    content: 'Today';
    position: absolute;
    top: 2px;
    left: 4px;
    padding: 1px 5px;
    border-radius: 3px;
    color: #fff;
    background: ${color.primary};
    ${font.bold}
    ${font.size(10.5)}
  }
`;

export const TimelineRow = styled.div`
  position: relative;
  height: ${props => props.height}px;
  border-bottom: 1px solid ${color.borderLightest};
  ${props => props.isChild && `background: ${mixin.rgba(color.backgroundLightest, 0.6)};`}
  ${props =>
    props.isSchedulable &&
    css`
      cursor: copy;
      &:hover:after {
        content: 'Click to schedule this epic';
        position: absolute;
        top: 12px;
        left: ${props.hintLeft}px;
        color: ${color.textMedium};
        white-space: nowrap;
        ${font.size(12.5)}
      }
    `}
`;

export const Bar = styled.div`
  position: absolute;
  top: 9px;
  height: ${ROW_HEIGHT - 18}px;
  border-radius: 4px;
  background: ${props => mixin.rgba(props.color, 0.85)};
  box-shadow: inset 0 0 0 1px ${props => mixin.darken(props.color, 0.15)};
  cursor: grab;
  z-index: 1;
  ${props => props.isDragging && 'cursor: grabbing; opacity: 0.85;'}
`;

export const BarProgress = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 4px 0 0 4px;
  background: rgba(0, 0, 0, 0.15);
  width: ${props => props.percent}%;
  pointer-events: none;
`;

export const BarLabel = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  top: 5px;
  color: #fff;
  pointer-events: none;
  ${font.medium}
  ${font.size(12.5)}
  ${mixin.truncateText}
`;

export const Handle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
  ${props => (props.side === 'left' ? 'left: 0;' : 'right: 0;')}
`;

export const SprintBar = styled.div`
  position: absolute;
  top: 12px;
  height: ${CHILD_HEIGHT - 24}px;
  border-radius: 6px;
  background: ${color.backgroundMedium};
  box-shadow: inset 0 0 0 1px ${color.borderLight};
`;

export const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${color.textMedium};
  ${font.size(14.5)}
`;
