import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'shared/components';
import { FormElement, FormHeading, Actions, ActionButton } from 'Project/SprintForm/Styles';
import { TEXT } from 'config/text';

const propTypes = {
  member: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const defaultProps = {
  member: null,
};

/** Add or edit a team member: name and email. */
const MemberForm = ({ member, onSubmit, modalClose }) => (
  <Form
    enableReinitialize
    initialValues={Form.initialValues(member || {}, get => ({
      name: get('name'),
      email: get('email'),
    }))}
    validations={{
      name: [Form.is.required(), Form.is.maxLength(100)],
      email: [Form.is.required(), Form.is.email()],
    }}
    onSubmit={async (values, form) => {
      try {
        await onSubmit(values);
        modalClose();
      } catch (error) {
        Form.handleAPIError(error, form);
      }
    }}
  >
    {({ isSubmitting }) => (
      <FormElement>
        <FormHeading>{member ? TEXT.team.edit : TEXT.team.add}</FormHeading>
        <Form.Field.Input name="name" label={TEXT.team.name} />
        <Form.Field.Input name="email" label={TEXT.team.email} />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isSubmitting}>
            {member ? TEXT.team.save : TEXT.team.add}
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            {TEXT.common.cancel}
          </ActionButton>
        </Actions>
      </FormElement>
    )}
  </Form>
);

MemberForm.propTypes = propTypes;
MemberForm.defaultProps = defaultProps;

export default MemberForm;
