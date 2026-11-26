import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, useHistory } from 'react-router-dom';
import moment from 'moment';

import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { issueStatusBackgroundColors } from 'shared/utils/styles';
import { Breadcrumbs, Button, Icon, Modal, IssueTypeIcon } from 'shared/components';

import IssueDetailsRoute from 'Project/IssueDetailsRoute';
import EpicForm from './EpicForm';
import {
  ROW_HEIGHT,
  CHILD_HEIGHT,
  Header,
  Title,
  HeaderActions,
  Zoom,
  Chart,
  Left,
  LeftHeader,
  EpicRow,
  Chevron,
  EpicSquare,
  EpicTitle,
  Progress,
  ProgressBar,
  ChildRow,
  ChildTitle,
  StatusDot,
  CreateEpic,
  Right,
  Canvas,
  TimeHeader,
  MonthLabel,
  WeekLabel,
  GridLine,
  TodayLine,
  TimelineRow,
  Bar,
  BarProgress,
  BarLabel,
  Handle,
  SprintBar,
  EmptyState,
} from './Styles';
import { TEXT } from 'config/text';
import { STATUS, ROADMAP } from 'config/app';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

const ZOOMS = {
  weeks: { label: TEXT.roadmap.zoom.weeks, dayWidth: 28, monthsBefore: 1, monthsAfter: 3 },
  months: { label: TEXT.roadmap.zoom.months, dayWidth: 8, monthsBefore: 1, monthsAfter: 8 },
  quarters: { label: TEXT.roadmap.zoom.quarters, dayWidth: 3, monthsBefore: 2, monthsAfter: 18 },
};

const day = value => moment(value).startOf('day');

const ProjectRoadmap = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const [zoom, setZoom] = useState(ROADMAP.defaultZoom);
  const [expanded, setExpanded] = useState({});
  const [epicModal, setEpicModal] = useState(null); // {} for create, epic for edit
  const [drag, setDrag] = useState(null); // { epicId, mode, startX, start, end, moved }
  const scrollRef = useRef();

  const epics = project.epics || [];
  const { dayWidth, monthsBefore, monthsAfter } = ZOOMS[zoom];

  // Visible range: around today, widened to include every scheduled epic.
  const range = useMemo(() => {
    let start = moment().startOf('month').subtract(monthsBefore, 'months');
    let end = moment().add(monthsAfter, 'months').endOf('month');
    epics.forEach(epic => {
      if (epic.startDate && moment(epic.startDate).isBefore(start)) start = moment(epic.startDate).startOf('month');
      if (epic.endDate && moment(epic.endDate).isAfter(end)) end = moment(epic.endDate).endOf('month');
    });
    return { start: start.startOf('day'), days: end.diff(start, 'days') + 1 };
  }, [epics, monthsBefore, monthsAfter]);

  const x = date => day(date).diff(range.start, 'days') * dayWidth;
  const todayX = x(moment());

  // Scroll so that today is visible when the page opens or the zoom changes.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = Math.max(0, todayX - 200);
  }, [zoom, todayX]);

  const months = [];
  for (let m = range.start.clone(); m.diff(range.start, 'days') < range.days; m.add(1, 'month').startOf('month')) {
    months.push(m.clone());
  }
  const weeks = [];
  if (zoom === 'weeks') {
    for (let w = range.start.clone().startOf('isoWeek'); w.diff(range.start, 'days') < range.days; w.add(1, 'week')) {
      if (!w.isBefore(range.start)) weeks.push(w.clone());
    }
  }

  const issuesOf = epic => project.issues.filter(issue => issue.epicId === epic.id);
  const sprintOf = issue => (project.sprints || []).find(sprint => sprint.id === issue.sprintId);

  /* ----- saving ----- */

  const saveEpic = async values => {
    if (epicModal && epicModal.id) {
      await api.put(`/epics/${epicModal.id}`, values);
      toast.success(TEXT.roadmap.updated);
    } else {
      await api.post('/epics', values);
      toast.success(TEXT.roadmap.created);
    }
    await fetchProject();
  };

  const deleteEpic = async () => {
    try {
      await api.delete(`/epics/${epicModal.id}`);
      await fetchProject();
      toast.success(TEXT.roadmap.deleted);
    } catch (error) {
      toast.error(error);
    }
  };

  const saveDates = async (epic, startDate, endDate) => {
    try {
      await api.put(`/epics/${epic.id}`, { startDate, endDate });
      await fetchProject();
    } catch (error) {
      toast.error(error);
    }
  };

  /* ----- dragging bars ----- */

  const startDrag = (event, epic, mode) => {
    event.preventDefault();
    event.stopPropagation();
    setDrag({ epicId: epic.id, mode, startX: event.clientX, start: day(epic.startDate), end: day(epic.endDate), deltaDays: 0 });
  };

  useEffect(() => {
    if (!drag) return undefined;
    const onMove = event => {
      const deltaDays = Math.round((event.clientX - drag.startX) / dayWidth);
      if (deltaDays !== drag.deltaDays) setDrag(current => ({ ...current, deltaDays }));
    };
    const onUp = () => {
      const epic = epics.find(e => e.id === drag.epicId);
      const { start, end } = draggedDates(drag);
      setDrag(null);
      if (epic && drag.deltaDays !== 0) saveDates(epic, start.toISOString(), end.toISOString());
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag, dayWidth, epics]);

  const datesFor = epic => {
    if (drag && drag.epicId === epic.id) return draggedDates(drag);
    return { start: day(epic.startDate), end: day(epic.endDate) };
  };

  const scheduleAt = (event, epic) => {
    const left = event.currentTarget.getBoundingClientRect().left;
    const start = range.start.clone().add(Math.floor((event.clientX - left) / dayWidth), 'days');
    saveDates(epic, start.toISOString(), start.clone().add(ROADMAP.newEpicDays - 1, 'days').toISOString());
  };

  /* ----- render ----- */

  const toggle = id => setExpanded(current => ({ ...current, [id]: !current[id] }));
  const openIssue = issueId => history.push(`${match.url}/issues/${issueId}`);
  const width = range.days * dayWidth;

  return (
    <Fragment>
      <Breadcrumbs items={[TEXT.nav.breadcrumbRoot, project.name, TEXT.roadmap.title]} />
      <Header>
        <Title>{TEXT.roadmap.title}</Title>
        <HeaderActions>
          <Zoom>
            {Object.entries(ZOOMS).map(([key, { label }]) => (
              <Button key={key} variant={zoom === key ? 'primary' : 'secondary'} onClick={() => setZoom(key)}>
                {label}
              </Button>
            ))}
          </Zoom>
          <Button variant="primary" icon="plus" onClick={() => setEpicModal({})}>
            {TEXT.roadmap.createEpic}
          </Button>
        </HeaderActions>
      </Header>

      <Chart>
        <Left>
          <LeftHeader>{TEXT.roadmap.epicsHeading}</LeftHeader>
          {epics.map(epic => {
            const issues = issuesOf(epic);
            const done = issues.filter(issue => issue.status === STATUS.done).length;
            const percent = issues.length ? Math.round((done / issues.length) * 100) : 0;
            return (
              <Fragment key={epic.id}>
                <EpicRow data-testid="roadmap-epic">
                  <Chevron isEmpty={!issues.length} onClick={() => issues.length && toggle(epic.id)}>
                    <Icon type={expanded[epic.id] ? 'chevron-down' : 'chevron-right'} />
                  </Chevron>
                  <EpicSquare color={epic.color} />
                  <EpicTitle title={TEXT.roadmap.editEpic} onClick={() => setEpicModal(epic)}>
                    {epic.title}
                  </EpicTitle>
                  <Progress title={TEXT.roadmap.progress(done, issues.length)}>
                    <ProgressBar percent={percent}>
                      <div />
                    </ProgressBar>
                    {done}/{issues.length}
                  </Progress>
                </EpicRow>
                {expanded[epic.id] &&
                  issues.map(issue => (
                    <ChildRow key={issue.id} onClick={() => openIssue(issue.id)}>
                      <IssueTypeIcon type={issue.type} size={16} />
                      <ChildTitle isDone={issue.status === STATUS.done}>{issue.title}</ChildTitle>
                      <StatusDot color={issueStatusBackgroundColors[issue.status]} title={issue.status} />
                    </ChildRow>
                  ))}
              </Fragment>
            );
          })}
          <CreateEpic onClick={() => setEpicModal({})}>
            <Icon type="plus" size={18} />
            {TEXT.roadmap.createEpic}
          </CreateEpic>
        </Left>

        <Right ref={scrollRef}>
          <Canvas width={width}>
            <TimeHeader>
              {months.map(month => (
                <MonthLabel key={month.format('YYYY-MM')} style={{ left: x(month) }}>
                  {zoom === 'quarters' && month.month() % 3 !== 0
                    ? ''
                    : month.format(zoom === 'quarters' ? '[Q]Q YYYY' : month.month() === 0 || zoom === 'weeks' ? 'MMMM YYYY' : 'MMMM')}
                </MonthLabel>
              ))}
              {weeks.map(week => (
                <WeekLabel key={week.format('YYYY-MM-DD')} style={{ left: x(week) }}>
                  {week.format('D MMM')}
                </WeekLabel>
              ))}
            </TimeHeader>

            {months.map(month => (
              <GridLine key={month.format('YYYY-MM')} strong style={{ left: x(month) }} />
            ))}
            {weeks.map(week => (
              <GridLine key={`w${week.format('YYYY-MM-DD')}`} style={{ left: x(week) }} />
            ))}
            <TodayLine style={{ left: todayX }} />

            {epics.map(epic => {
              const issues = issuesOf(epic);
              const done = issues.filter(issue => issue.status === STATUS.done).length;
              const isScheduled = epic.startDate && epic.endDate;
              const { start, end } = isScheduled ? datesFor(epic) : {};
              return (
                <Fragment key={epic.id}>
                  <TimelineRow
                    height={ROW_HEIGHT}
                    isSchedulable={!isScheduled}
                    hintLeft={Math.max(10, todayX - 80)}
                    onClick={event => !isScheduled && scheduleAt(event, epic)}
                  >
                    {isScheduled && (
                      <Bar
                        color={epic.color}
                        isDragging={drag && drag.epicId === epic.id}
                        style={{ left: x(start), width: (end.diff(start, 'days') + 1) * dayWidth }}
                        title={`${epic.title}: ${start.format('MMM D')} – ${end.format('MMM D')}`}
                        onMouseDown={event => startDrag(event, epic, 'move')}
                        data-testid="roadmap-bar"
                      >
                        <BarProgress percent={issues.length ? (done / issues.length) * 100 : 0} />
                        <BarLabel>{epic.title}</BarLabel>
                        <Handle side="left" onMouseDown={event => startDrag(event, epic, 'start')} />
                        <Handle side="right" onMouseDown={event => startDrag(event, epic, 'end')} />
                      </Bar>
                    )}
                  </TimelineRow>
                  {expanded[epic.id] &&
                    issues.map(issue => {
                      const sprint = sprintOf(issue);
                      const hasDates = sprint && sprint.startDate && sprint.endDate;
                      return (
                        <TimelineRow key={issue.id} height={CHILD_HEIGHT} isChild>
                          {hasDates && (
                            <SprintBar
                              title={`${sprint.name}: ${moment(sprint.startDate).format('MMM D')} – ${moment(sprint.endDate).format('MMM D')}`}
                              style={{
                                left: x(sprint.startDate),
                                width: (day(sprint.endDate).diff(day(sprint.startDate), 'days') + 1) * dayWidth,
                              }}
                            />
                          )}
                        </TimelineRow>
                      );
                    })}
                </Fragment>
              );
            })}
            <TimelineRow height={ROW_HEIGHT} />
          </Canvas>
        </Right>
      </Chart>

      {epics.length === 0 && <EmptyState>{TEXT.roadmap.empty}</EmptyState>}

      {epicModal && (
        <Modal
          isOpen
          testid="modal:epic"
          width={600}
          withCloseIcon={false}
          onClose={() => setEpicModal(null)}
          renderContent={modal => (
            <EpicForm
              epic={epicModal}
              onSubmit={saveEpic}
              onDelete={epicModal.id ? deleteEpic : undefined}
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

/** New start/end while a bar is being dragged (moved, or resized from either edge). */
const draggedDates = ({ mode, start, end, deltaDays }) => {
  if (mode === 'move') return { start: start.clone().add(deltaDays, 'days'), end: end.clone().add(deltaDays, 'days') };
  if (mode === 'start') {
    const newStart = start.clone().add(deltaDays, 'days');
    return { start: newStart.isAfter(end) ? end.clone() : newStart, end };
  }
  const newEnd = end.clone().add(deltaDays, 'days');
  return { start, end: newEnd.isBefore(start) ? start.clone() : newEnd };
};

ProjectRoadmap.propTypes = propTypes;

export default ProjectRoadmap;
