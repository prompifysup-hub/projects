import React from 'react';
import PropTypes from 'prop-types';

import { Form, ConfirmModal, Button } from 'shared/components';

import { FormElement, FormHeading, DateRow, Actions, ActionButton } from 'Project/SprintForm/Styles';
import { EpicSquare } from './Styles';
import { TEXT } from 'config/text';
import { EPIC_COLORS } from 'config/app';


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
      if (!values.title || !values.title.trim()) errors.title = TEXT.errors.required;
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
        <FormHeading>{epic.id ? TEXT.roadmap.editEpic : TEXT.roadmap.createEpic}</FormHeading>
        <Form.Field.Input name="title" label={TEXT.epic.name} tip={TEXT.epic.nameTip} />
        <Form.Field.Select
          name="color"
          label={TEXT.epic.color}
          withClearValue={false}
          options={EPIC_COLORS}
          renderOption={renderColor}
          renderValue={renderColor}
        />
        <DateRow>
          <Form.Field.DatePicker name="startDate" label={TEXT.epic.start} withTime={false} />
          <Form.Field.DatePicker name="endDate" label={TEXT.epic.due} withTime={false} />
        </DateRow>
        <Form.Field.Textarea name="description" label={TEXT.epic.description} />
        <Actions>
          {onDelete && (
            <ConfirmModal
              variant="danger"
              title={TEXT.epic.deleteTitle(epic.title)}
              message={TEXT.epic.deleteMessage}
              confirmText={TEXT.epic.deleteConfirm}
              onConfirm={async modal => {
                await onDelete();
                modal.close();
                modalClose();
              }}
              renderLink={modal => (
                <Button type="button" variant="empty" icon="trash" onClick={modal.open} style={{ marginRight: 'auto' }}>
                  {TEXT.epic.delete}
                </Button>
              )}
            />
          )}
          <ActionButton type="submit" variant="primary" isWorking={isSubmitting}>
            {epic.id ? TEXT.epic.saveChanges : TEXT.roadmap.createEpic}
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            {TEXT.common.cancel}
          </ActionButton>
        </Actions>
      </FormElement>
    )}
  </Form>
);

EpicForm.propTypes = propTypes;
EpicForm.defaultProps = defaultProps;

export default EpicForm;
