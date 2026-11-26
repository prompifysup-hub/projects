import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Select } from 'shared/components';

import { SectionTitle } from '../Styles';
import { Item, Label, EpicColor } from './Styles';
import { TEXT } from 'config/text';
import { FEATURES } from 'config/app';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
  sprints: PropTypes.array.isRequired,
  epics: PropTypes.array.isRequired,
};

const NONE = 'none';

/** Sprint and epic of an issue. */
const ProjectBoardIssueDetailsPlanning = ({ issue, updateIssue, sprints, epics }) => {
  const sprintOptions = [
    { value: NONE, label: TEXT.issue.noSprint },
    ...sprints
      .filter(sprint => sprint.status !== 'completed' || sprint.id === issue.sprintId)
      .map(sprint => ({ value: sprint.id, label: sprint.name })),
  ];
  const epicOptions = [
    { value: NONE, label: TEXT.issue.noEpic },
    ...epics.map(epic => ({ value: epic.id, label: epic.title })),
  ];

  // The Select passes only { value } when rendering the current value, so look the label up.
  const labelOf = (options, value) => (options.find(option => option.value === value) || {}).label;

  const renderEpic = ({ value }, isValue) => {
    const epic = epics.find(({ id }) => id === value);
    const label = labelOf(epicOptions, value);
    return (
      <Item isValue={isValue}>
        {epic && <EpicColor color={epic.color} />}
        <Label>{label}</Label>
      </Item>
    );
  };

  return (
    <Fragment>
      {FEATURES.sprints && <SectionTitle>{TEXT.issue.sprint}</SectionTitle>}
      {FEATURES.sprints && (
        <Select
          variant="empty"
          withClearValue={false}
          dropdownWidth={343}
          name="sprint"
          value={issue.sprintId || NONE}
          options={sprintOptions}
          onChange={value => updateIssue({ sprintId: value === NONE ? null : value })}
          renderValue={({ value }) => (
            <Item isValue>
              <Label>{labelOf(sprintOptions, value)}</Label>
            </Item>
          )}
          renderOption={({ label }) => (
            <Item>
              <Label>{label}</Label>
            </Item>
          )}
        />
      )}

      {FEATURES.roadmap && <SectionTitle>{TEXT.issue.epic}</SectionTitle>}
      {FEATURES.roadmap && (
        <Select
          variant="empty"
          withClearValue={false}
          dropdownWidth={343}
          name="epic"
          value={issue.epicId || NONE}
          options={epicOptions}
          onChange={value => updateIssue({ epicId: value === NONE ? null : value })}
          renderValue={option => renderEpic(option, true)}
          renderOption={option => renderEpic(option)}
        />
      )}
    </Fragment>
  );
};

ProjectBoardIssueDetailsPlanning.propTypes = propTypes;

export default ProjectBoardIssueDetailsPlanning;
