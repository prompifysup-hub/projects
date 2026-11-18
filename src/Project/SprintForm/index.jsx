import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'shared/components';

import { FormElement, FormHeading, Actions, ActionButton, DateRow } from './Styles';

const propTypes = {
  title: PropTypes.string.isRequired,
  submitText: PropTypes.string.isRequired,
  sprint: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const defaultProps = {
  sprint: {},
};

/** Create / edit / start a sprint: name, goal and dates. */
const SprintForm = ({ title, submitText, sprint, onSubmit, modalClose }) => (
  <Form
    enableReinitialize
    initialValues={Form.initialValues(sprint, get => ({
      name: get('name'),
      goal: get('goal'),
      startDate: get('startDate', null),
      endDate: get('endDate', null),
    }))}
    validations={{
      name: [Form.is.required(), Form.is.maxLength(100)],
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
        <FormHeading>{title}</FormHeading>
        <Form.Field.Input name="name" label="Sprint name" />
        <Form.Field.Textarea name="goal" label="Sprint goal" tip="What should this sprint achieve?" />
        <DateRow>
          <Form.Field.DatePicker name="startDate" label="Start date" withTime={false} />
          <Form.Field.DatePicker name="endDate" label="End date" withTime={false} />
        </DateRow>
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isSubmitting}>
            {submitText}
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    )}
  </Form>
);

SprintForm.propTypes = propTypes;
SprintForm.defaultProps = defaultProps;

export default SprintForm;
