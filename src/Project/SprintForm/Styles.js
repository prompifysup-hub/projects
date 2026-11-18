import styled from 'styled-components';

import { color, font } from 'shared/utils/styles';
import { Button, Form } from 'shared/components';

export const FormElement = styled(Form.Element)`
  padding: 25px 40px 35px;
`;

export const FormHeading = styled.div`
  padding-bottom: 15px;
  ${font.size(21)}
`;

export const DateRow = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
  & > * + * {
    margin-left: 16px;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 30px;
  border-top: 1px solid ${color.borderLightest};
  margin-top: 20px;
`;

export const ActionButton = styled(Button)`
  margin-left: 10px;
`;
