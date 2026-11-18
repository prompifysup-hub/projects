import React from 'react';
import PropTypes from 'prop-types';

import { Form, ConfirmModal, Button } from 'shared/components';

import { FormElement, FormHeading, DateRow, Actions, ActionButton } from 'Project/SprintForm/Styles';
import { EpicSquare } from './Styles';

export const EPIC_COLORS = [
  { value: '#4FADE6', label: 'Blue' },
  { value: '#65BA43', label: 'Green' },
  { value: '#F89C1C', label: 'Orange' },
  { value: '#E44D42', label: 'Red' },
  { value: '#8777D9', label: 'Purple' },
  { value: '#00B8D9', label: 'Teal' },
  { value: '#6B778C', label: 'Grey' },
];

const propTypes = {
  epic: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  modalClose: PropTypes.func.isRequired,
};

const defaultProps = {
  epic: {},
  onDelete: undefined,
};

// The Select passes only { value } when rendering the current value, so look the label up.
const renderColor = ({ value }) => (
  <span style={{ display: 'flex', alignItems: 'center' }}>
    <EpicSquare color={value} />
    {(EPIC_COLORS.find(option => option.value === value) || {}).label}
  </span>
);

/** Create / edit an epic: title, colour, dates, description. */
const EpicForm = ({ epic, onSubmit, onDelete, modalClose }) => (
  <Form
    enableReinitialize
    initialValues={Form.initialValues(epic, get => ({
      title: get('title'),
      color: get('color', EPIC_COLORS[0].value),
      startDate: get('startDate', null),
      endDate: get('endDate', null),
      description: get('description'),
    }))}
    validations={{
      title: [Form.is.required(), Form.is.maxLength(200)],
      color: Form.is.required(),
    }}
    validate={values => {
      const errors = {};
      if (!values.title || !values.title.trim()) errors.title = 'This field is required';
      if (values.startDate && values.endDate && values.endDate < values.startDate) {
        errors.endDate = 'End date must be after the start date';
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
        <FormHeading>{epic.id ? 'Edit epic' : 'Create epic'}</FormHeading>
        <Form.Field.Input name="title" label="Epic name" tip="A larger piece of work, e.g. “New homepage”." />
        <Form.Field.Select
          name="color"
          label="Colour"
          withClearValue={false}
          options={EPIC_COLORS}
          renderOption={renderColor}
          renderValue={renderColor}
        />
        <DateRow>
          <Form.Field.DatePicker name="startDate" label="Start date" withTime={false} />
          <Form.Field.DatePicker name="endDate" label="Due date" withTime={false} />
        </DateRow>
        <Form.Field.Textarea name="description" label="Description" />
        <Actions>
          {onDelete && (
            <ConfirmModal
              variant="danger"
              title={`Delete “${epic.title}”?`}
              message="Its issues are kept but no longer belong to an epic."
              confirmText="Delete epic"
              onConfirm={async modal => {
                await onDelete();
                modal.close();
                modalClose();
              }}
              renderLink={modal => (
                <Button type="button" variant="empty" icon="trash" onClick={modal.open} style={{ marginRight: 'auto' }}>
                  Delete
                </Button>
              )}
            />
          )}
          <ActionButton type="submit" variant="primary" isWorking={isSubmitting}>
            {epic.id ? 'Save changes' : 'Create epic'}
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    )}
  </Form>
);

EpicForm.propTypes = propTypes;
EpicForm.defaultProps = defaultProps;

export default EpicForm;
