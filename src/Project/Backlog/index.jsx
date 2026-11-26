import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import useCurrentUser from 'shared/hooks/currentUser';
import { IssueStatusCopy } from 'shared/constants/issues';
import { issueStatusColors, issueStatusBackgroundColors } from 'shared/utils/styles';
import { getActiveSprint, getOpenSprints, formatSprintDates } from 'shared/utils/sprints';
import { moveItemWithinArray, insertItemIntoArray } from 'shared/utils/javascript';
import {
  Breadcrumbs,
  Button,
  Icon,
  Avatar,
  Input,
  Modal,
  ConfirmModal,
  IssueTypeIcon,
  IssuePriorityIcon,
} from 'shared/components';

import IssueDetailsRoute from 'Project/IssueDetailsRoute';
import SprintForm from 'Project/SprintForm';
import {
  Header,
  Title,
  Section,
  SectionHeader,
  Toggle,
  SectionName,
  SectionMeta,
  SectionActions,
  Points,
  Goal,
  Issues,
  Empty,
  Row,
  RowTitle,
  EpicTag,
  StatusTag,
  Assignees,
  CreateLink,
  CreateForm,
} from './Styles';
import { TEXT } from 'config/text';
import { STATUS, DEFAULT_TYPE, DEFAULT_PRIORITY, SPRINT, FEATURES } from 'config/app';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

const BACKLOG = 'backlog';

const groupIssues = (issues, groupId) =>
  issues
    .filter(issue => (issue.sprintId || BACKLOG) === groupId)
    .sort((a, b) => (a.backlogPosition || 0) - (b.backlogPosition || 0));

const ProjectBacklog = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const [collapsed, setCollapsed] = useState({});
  const [sprintModal, setSprintModal] = useState(null); // { mode: 'create' | 'edit' | 'start', sprint }

  const activeSprint = getActiveSprint(project);
  const sprints = getOpenSprints(project);

  const toggle = id => setCollapsed(current => ({ ...current, [id]: !current[id] }));
  const openIssue = issueId => history.push(`${match.url}/issues/${issueId}`);

  const handleDrop = ({ draggableId, destination, source }) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const issue = project.issues.find(({ id }) => String(id) === draggableId);
    const before = groupIssues(project.issues, destination.droppableId);
    const after =
      destination.droppableId === source.droppableId
        ? moveItemWithinArray(before, issue, destination.index)
        : insertItemIntoArray(before, issue, destination.index);
    const prev = after[destination.index - 1];
    const next = after[destination.index + 1];
    let backlogPosition = 1;
    if (prev && next) backlogPosition = (prev.backlogPosition + next.backlogPosition) / 2;
    else if (prev) backlogPosition = prev.backlogPosition + 1;
    else if (next) backlogPosition = next.backlogPosition - 1;

    api.optimisticUpdate(`/issues/${issue.id}`, {
      updatedFields: {
        sprintId: destination.droppableId === BACKLOG ? null : destination.droppableId,
        backlogPosition,
      },
      currentFields: issue,
      setLocalData: fields => updateLocalProjectIssues(issue.id, fields),
    });
  };

  const saveSprint = async values => {
    const { mode, sprint } = sprintModal;
    if (mode === 'create') {
      await api.post('/sprints', values);
      toast.success(TEXT.sprint.created);
    } else if (mode === 'edit') {
      await api.put(`/sprints/${sprint.id}`, values);
      toast.success(TEXT.sprint.updated);
    } else {
      await api.put(`/sprints/${sprint.id}`, {
        ...values,
        status: 'active',
        startDate: values.startDate || new Date().toISOString(),
        endDate: values.endDate || new Date(Date.now() + SPRINT.defaultLengthDays * 864e5).toISOString(),
      });
      toast.success(TEXT.sprint.started(values.name));
    }
    await fetchProject();
  };

  const runSprintAction = async (action, successMessage, modal) => {
    try {
      await action();
      await fetchProject();
      toast.success(successMessage);
    } catch (error) {
      toast.error(error);
    }
    modal.close();
  };

  const renderSection = (groupId, sprint) => {
    const issues = groupIssues(project.issues, groupId);
    const points = issues.reduce((sum, issue) => sum + (issue.estimate || 0), 0);
    const isCollapsed = collapsed[groupId];
    const isActive = sprint && sprint.status === 'active';

    return (
      <Section key={groupId} data-testid={`backlog-section:${groupId}`}>
        <SectionHeader>
          <Toggle onClick={() => toggle(groupId)}>
            <Icon type={isCollapsed ? 'chevron-right' : 'chevron-down'} />
            <SectionName>{sprint ? sprint.name : TEXT.backlog.section}</SectionName>
            <SectionMeta>
              {sprint && formatSprintDates(sprint) ? `${formatSprintDates(sprint)} · ` : ''}
              {TEXT.backlog.issueCount(issues.length)}
              {isActive ? TEXT.backlog.active : ''}
            </SectionMeta>
          </Toggle>
          <SectionActions>
            {points > 0 && <Points title={TEXT.backlog.totalEstimate}>{points}</Points>}
            {sprint && isActive && (
              <ConfirmModal
                title={TEXT.sprint.completeTitle(sprint.name)}
                message={TEXT.sprint.completeMessage}
                confirmText={TEXT.sprint.complete}
                onConfirm={modal =>
                  runSprintAction(
                    () => api.post(`/sprints/${sprint.id}/complete`),
                    TEXT.sprint.completed,
                    modal,
                  )
                }
                renderLink={modal => <Button onClick={modal.open}>{TEXT.sprint.complete}</Button>}
              />
            )}
            {sprint && !isActive && (
              <Button
                variant="primary"
                disabled={!!activeSprint}
                title={activeSprint ? TEXT.sprint.startBlocked(activeSprint.name) : undefined}
                onClick={() => setSprintModal({ mode: 'start', sprint })}
              >
                {TEXT.sprint.start}
              </Button>
            )}
            {sprint && (
              <Button
                icon="settings"
                variant="empty"
                title={TEXT.sprint.edit}
                onClick={() => setSprintModal({ mode: 'edit', sprint })}
              />
            )}
            {sprint && !isActive && (
              <ConfirmModal
                variant="danger"
                title={TEXT.sprint.deleteTitle(sprint.name)}
                message={TEXT.sprint.deleteMessage}
                confirmText={TEXT.sprint.delete}
                onConfirm={modal =>
                  runSprintAction(() => api.delete(`/sprints/${sprint.id}`), TEXT.sprint.deleted, modal)
                }
                renderLink={modal => (
                  <Button icon="trash" variant="empty" title={TEXT.sprint.delete} onClick={modal.open} />
                )}
              />
            )}
          </SectionActions>
        </SectionHeader>
        {sprint && sprint.goal && !isCollapsed && <Goal>{sprint.goal}</Goal>}

        {!isCollapsed && (
          <Fragment>
            <Droppable droppableId={String(groupId)}>
              {(provided, snapshot) => (
                <Issues
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {issues.length === 0 && !snapshot.isDraggingOver && (
                    <Empty>{sprint ? TEXT.backlog.emptySprint : TEXT.backlog.emptyBacklog}</Empty>
                  )}
                  {issues.map((issue, index) => (
                    <IssueRow
                      key={issue.id}
                      issue={issue}
                      index={index}
                      project={project}
                      onOpen={() => openIssue(issue.id)}
                    />
                  ))}
                  {provided.placeholder}
                </Issues>
              )}
            </Droppable>
            <InlineCreate sprintId={sprint ? sprint.id : null} fetchProject={fetchProject} />
          </Fragment>
        )}
      </Section>
    );
  };

  return (
    <Fragment>
      <Breadcrumbs items={[TEXT.nav.breadcrumbRoot, project.name, TEXT.backlog.title]} />
      <Header>
        <Title>{TEXT.backlog.title}</Title>
        <Button icon="plus" onClick={() => setSprintModal({ mode: 'create', sprint: {} })}>
          {TEXT.sprint.create}
        </Button>
      </Header>

      <DragDropContext onDragEnd={handleDrop}>
        {sprints.map(sprint => renderSection(sprint.id, sprint))}
        {renderSection(BACKLOG, null)}
      </DragDropContext>

      {sprintModal && (
        <Modal
          isOpen
          testid="modal:sprint"
          width={600}
          withCloseIcon={false}
          onClose={() => setSprintModal(null)}
          renderContent={modal => (
            <SprintForm
              title={{ create: TEXT.sprint.create, edit: TEXT.sprint.edit, start: TEXT.sprint.start }[sprintModal.mode]}
              submitText={{ create: TEXT.sprint.create, edit: TEXT.sprint.saveChanges, start: TEXT.sprint.start }[sprintModal.mode]}
              sprint={
                sprintModal.mode === 'create'
                  ? { name: TEXT.sprint.defaultName((project.sprints || []).length + 1) }
                  : sprintModal.sprint
              }
              onSubmit={saveSprint}
              modalClose={modal.close}
            />
          )}
        />
      )}

      <IssueDetailsRoute
        project={project}
        fetchProject={fetchProject}
        updateLocalProjectIssues={updateLocalProjectIssues}
      />
    </Fragment>
  );
};

const IssueRow = ({ issue, index, project, onOpen }) => {
  const epic = (project.epics || []).find(({ id }) => id === issue.epicId);
  const assignees = issue.userIds
    .map(userId => project.users.find(user => user.id === userId))
    .filter(Boolean);

  return (
    <Draggable draggableId={String(issue.id)} index={index}>
      {(provided, snapshot) => (
        <Row
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
          onClick={onOpen}
          data-testid="backlog-issue"
        >
          <IssueTypeIcon type={issue.type} />
          <IssuePriorityIcon priority={issue.priority} />
          <RowTitle isDone={issue.status === STATUS.done}>{issue.title}</RowTitle>
          {FEATURES.roadmap && epic && (
            <EpicTag color={epic.color}>
              <span>{epic.title}</span>
            </EpicTag>
          )}
          <StatusTag
            background={issueStatusBackgroundColors[issue.status]}
            textColor={issueStatusColors[issue.status]}
          >
            {IssueStatusCopy[issue.status]}
          </StatusTag>
          {issue.estimate ? <Points title={TEXT.backlog.estimate}>{issue.estimate}</Points> : null}
          <Assignees>
            {assignees.map(user => (
              <Avatar key={user.id} size={24} avatarUrl={user.avatarUrl} name={user.name} />
            ))}
          </Assignees>
        </Row>
      )}
    </Draggable>
  );
};

IssueRow.propTypes = {
  issue: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  project: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
};

/** "+ Create issue" at the bottom of a sprint or the backlog: type a title, press Enter. */
const InlineCreate = ({ sprintId, fetchProject }) => {
  const { currentUserId } = useCurrentUser();
  const [isOpen, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isSaving, setSaving] = useState(false);

  const create = async event => {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await api.post('/issues', {
        title: title.trim(),
        type: DEFAULT_TYPE,
        status: STATUS.initial,
        priority: DEFAULT_PRIORITY,
        reporterId: currentUserId,
        userIds: [],
        sprintId,
      });
      await fetchProject();
      setTitle('');
    } catch (error) {
      toast.error(error);
    }
    setSaving(false);
  };

  if (!isOpen) {
    return (
      <CreateLink onClick={() => setOpen(true)}>
        <Icon type="plus" size={18} />
        {TEXT.backlog.createIssue}
      </CreateLink>
    );
  }

  return (
    <CreateForm onSubmit={create}>
      <Input
        autoFocus
        value={title}
        disabled={isSaving}
        placeholder={TEXT.backlog.createPlaceholder}
        onChange={setTitle}
        onKeyDown={event => event.key === 'Escape' && setOpen(false)}
        onBlur={() => !title.trim() && setOpen(false)}
      />
    </CreateForm>
  );
};

InlineCreate.propTypes = {
  sprintId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fetchProject: PropTypes.func.isRequired,
};

InlineCreate.defaultProps = {
  sprintId: null,
};

ProjectBacklog.propTypes = propTypes;

export default ProjectBacklog;
