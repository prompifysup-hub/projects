import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'shared/components';

import { FormElement, FormHeading, Actions, ActionButton, DateRow } from './Styles';
import { TEXT } from 'config/text';

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
    // `validate` replaces `validations` in Form, so every rule lives here.
    validate={values => {
      const errors = {};
      const name = (values.name || '').trim();
      if (!name) errors.name = TEXT.errors.required;
      else if (name.length > 100) errors.name = TEXT.errors.maxLength(100);
      if (values.startDate && values.endDate && values.endDate < values.startDate) {
        errors.endDate = TEXT.errors.endBeforeStart;
      }
      return errors;
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
        <Form.Field.Input name="name" label={TEXT.sprint.form.name} />
        <Form.Field.Textarea name="goal" label={TEXT.sprint.form.goal} tip={TEXT.sprint.form.goalTip} />
        <DateRow>
          <Form.Field.DatePicker name="startDate" label={TEXT.sprint.form.start} withTime={false} />
          <Form.Field.DatePicker name="endDate" label={TEXT.sprint.form.end} withTime={false} />
        </DateRow>
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isSubmitting}>
            {submitText}
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            {TEXT.common.cancel}
          </ActionButton>
        </Actions>
      </FormElement>
    )}
  </Form>
);

SprintForm.propTypes = propTypes;
SprintForm.defaultProps = defaultProps;

export default SprintForm;
