import React from 'react';
import PropTypes from 'prop-types';

import {
  IssueType,
  IssueStatus,
  IssuePriority,
  IssueTypeCopy,
  IssuePriorityCopy,
} from 'shared/constants/issues';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import useCurrentUser from 'shared/hooks/currentUser';
import { getActiveSprint } from 'shared/utils/sprints';
import { Form, IssueTypeIcon, Icon, Avatar, IssuePriorityIcon } from 'shared/components';

import {
  FormHeading,
  FormElement,
  SelectItem,
  SelectItemLabel,
  Divider,
  Actions,
  ActionButton,
  EpicDot,
} from './Styles';
import { TEXT } from 'config/text';
import { STATUS, DEFAULT_TYPE, DEFAULT_PRIORITY, FEATURES } from 'config/app';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectIssueCreate = ({ project, fetchProject, onCreate, modalClose }) => {
  const [{ isCreating }, createIssue] = useApi.post('/issues');

  const { currentUserId } = useCurrentUser();

  return (
    <Form
      enableReinitialize
      initialValues={{
        type: DEFAULT_TYPE,
        title: '',
        description: '',
        reporterId: currentUserId,
        userIds: [],
        priority: DEFAULT_PRIORITY,
        sprintId: (getActiveSprint(project) || {}).id || NONE,
        epicId: NONE,
      }}
      validations={{
        type: Form.is.required(),
        title: [Form.is.required(), Form.is.maxLength(200)],
        reporterId: Form.is.required(),
        priority: Form.is.required(),
      }}
      onSubmit={async (values, form) => {
        try {
          await createIssue({
            ...values,
            sprintId: values.sprintId === NONE ? null : values.sprintId,
            epicId: values.epicId === NONE ? null : values.epicId,
            status: STATUS.initial,
            projectId: project.id,
            users: values.userIds.map(id => ({ id })),
          });
          await fetchProject();
          toast.success(TEXT.create.created);
          onCreate();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <FormHeading>{TEXT.create.title}</FormHeading>
        <Form.Field.Select
          name="type"
          label={TEXT.create.type}
          tip={TEXT.create.typeTip}
          options={typeOptions}
          renderOption={renderType}
          renderValue={renderType}
        />
        <Divider />
        <Form.Field.Input name="title" label={TEXT.create.summary} tip={TEXT.create.summaryTip} />
        <Form.Field.TextEditor
          name="description"
          label={TEXT.create.description}
          tip={TEXT.create.descriptionTip}
        />
        <Form.Field.Select
          name="reporterId"
          label={TEXT.create.reporter}
          options={userOptions(project)}
          renderOption={renderUser(project)}
          renderValue={renderUser(project)}
        />
        <Form.Field.Select
          isMulti
          name="userIds"
          label={TEXT.create.assignees}
          tip={TEXT.create.assigneesTip}
          options={userOptions(project)}
          renderOption={renderUser(project)}
          renderValue={renderUser(project)}
        />
        <Form.Field.Select
          name="priority"
          label={TEXT.create.priority}
          tip={TEXT.create.priorityTip}
          options={priorityOptions}
          renderOption={renderPriority}
          renderValue={renderPriority}
        />
        {FEATURES.sprints && (
          <Form.Field.Select
            name="sprintId"
            label={TEXT.create.sprint}
            tip={TEXT.create.sprintTip}
            options={sprintOptions(project)}
            renderOption={renderPlain(sprintOptions(project))}
            renderValue={renderPlain(sprintOptions(project))}
          />
        )}
        {FEATURES.roadmap && (
          <Form.Field.Select
            name="epicId"
            label={TEXT.create.epic}
            options={epicOptions(project)}
            renderOption={renderEpic(project)}
            renderValue={renderEpic(project)}
          />
        )}
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isCreating}>
            {TEXT.create.submit}
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            {TEXT.common.cancel}
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

const NONE = 'none';

const sprintOptions = project => [
  { value: NONE, label: TEXT.issue.noSprint },
  ...(project.sprints || [])
    .filter(sprint => sprint.status !== 'completed')
    .map(sprint => ({ value: sprint.id, label: sprint.name })),
];

const epicOptions = project => [
  { value: NONE, label: TEXT.issue.noEpic },
  ...(project.epics || []).map(epic => ({ value: epic.id, label: epic.title })),
];

// The Select passes only { value } when rendering the current value, so look the label up.
const renderPlain =
  options =>
  ({ value }) =>
    (
      <SelectItem>
        <SelectItemLabel>
          {(options.find(option => option.value === value) || {}).label}
        </SelectItemLabel>
      </SelectItem>
    );

const renderEpic =
  project =>
  ({ value }) => {
    const epic = (project.epics || []).find(({ id }) => id === value);
    const label = epic ? epic.title : TEXT.issue.noEpic;
    return (
      <SelectItem>
        {epic && <EpicDot color={epic.color} />}
        <SelectItemLabel>{label}</SelectItemLabel>
      </SelectItem>
    );
  };

const typeOptions = Object.values(IssueType).map(type => ({
  value: type,
  label: IssueTypeCopy[type],
}));

const priorityOptions = Object.values(IssuePriority).map(priority => ({
  value: priority,
  label: IssuePriorityCopy[priority],
}));

const userOptions = project => project.users.map(user => ({ value: user.id, label: user.name }));

const renderType = ({ value: type }) => (
  <SelectItem>
    <IssueTypeIcon type={type} top={1} />
    <SelectItemLabel>{IssueTypeCopy[type]}</SelectItemLabel>
  </SelectItem>
);

const renderPriority = ({ value: priority }) => (
  <SelectItem>
    <IssuePriorityIcon priority={priority} top={1} />
    <SelectItemLabel>{IssuePriorityCopy[priority]}</SelectItemLabel>
  </SelectItem>
);

const renderUser =
  project =>
  ({ value: userId, removeOptionValue }) => {
    const user = project.users.find(({ id }) => id === userId);

    return (
      <SelectItem
        key={user.id}
        withBottomMargin={!!removeOptionValue}
        onClick={() => removeOptionValue && removeOptionValue()}
      >
        <Avatar size={20} avatarUrl={user.avatarUrl} name={user.name} />
        <SelectItemLabel>{user.name}</SelectItemLabel>
        {removeOptionValue && <Icon type="close" top={2} />}
      </SelectItem>
    );
  };

ProjectIssueCreate.propTypes = propTypes;

export default ProjectIssueCreate;
