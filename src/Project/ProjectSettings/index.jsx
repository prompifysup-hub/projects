import React from 'react';
import PropTypes from 'prop-types';

import { ProjectCategory, ProjectCategoryCopy } from 'shared/constants/projects';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { Form, Breadcrumbs } from 'shared/components';

import Team from './Team';
import { Page, FormHeading, FormElement, ActionButton } from './Styles';
import { TEXT } from 'config/text';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
};

const ProjectSettings = ({ project, fetchProject }) => {
  const [{ isUpdating }, updateProject] = useApi.put('/project');

  return (
    <Page>
      <Form
        initialValues={Form.initialValues(project, get => ({
          name: get('name'),
          url: get('url'),
          category: get('category'),
          description: get('description'),
        }))}
        validations={{
          name: [Form.is.required(), Form.is.maxLength(100)],
          url: Form.is.url(),
          category: Form.is.required(),
        }}
        onSubmit={async (values, form) => {
          try {
            await updateProject(values);
            await fetchProject();
            toast.success(TEXT.settings.saved);
          } catch (error) {
            Form.handleAPIError(error, form);
          }
        }}
      >
        <FormElement>
          <Breadcrumbs items={[TEXT.nav.breadcrumbRoot, project.name, TEXT.settings.title]} />
          <FormHeading>{TEXT.settings.title}</FormHeading>

          <Form.Field.Input name="name" label={TEXT.settings.name} />
          <Form.Field.Input name="url" label={TEXT.settings.url} />
          <Form.Field.TextEditor
            name="description"
            label={TEXT.settings.description}
            tip={TEXT.settings.descriptionTip}
          />
          <Form.Field.Select name="category" label={TEXT.settings.category} options={categoryOptions} />

          <ActionButton type="submit" variant="primary" isWorking={isUpdating}>
            {TEXT.settings.save}
          </ActionButton>
        </FormElement>
      </Form>
      <Team users={project.users} fetchProject={fetchProject} />
    </Page>
  );
};

const categoryOptions = Object.values(ProjectCategory).map(category => ({
  value: category,
  label: ProjectCategoryCopy[category],
}));

ProjectSettings.propTypes = propTypes;

export default ProjectSettings;
