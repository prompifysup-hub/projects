import styled from 'styled-components';

import { color, font } from 'shared/utils/styles';
import { Button, Form } from 'shared/components';

export const FormElement = styled(Form.Element)`
  width: 100%;
  max-width: 640px;
`;

export const FormHeading = styled.h1`
  padding: 6px 0 15px;
  ${font.size(24)}
  ${font.heading}
`;

export const ActionButton = styled(Button)`
  margin-top: 30px;
`;

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60px;
`;

export const TeamSection = styled.section`
  width: 100%;
  max-width: 640px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid ${color.borderLightest};
`;

export const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
`;

export const Member = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${color.borderLightest};
`;

export const MemberText = styled.div`
  flex: 1;
  min-width: 0;
  padding-left: 12px;
`;

export const MemberName = styled.div`
  color: ${color.textDarkest};
  ${font.size(15)}
  ${font.medium}
`;

export const MemberEmail = styled.div`
  padding-top: 2px;
  color: ${color.textMedium};
  ${font.size(13)}
`;

export const MemberActions = styled.div`
  display: flex;
  align-items: center;
`;

export const YouTag = styled.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: var(--radius, 3px);
  color: ${color.textDark};
  background: ${color.backgroundMedium};
  ${font.size(11)}
  ${font.bold}
  text-transform: uppercase;
`;
