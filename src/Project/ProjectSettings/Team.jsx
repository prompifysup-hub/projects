import React, { useState } from 'react';
import PropTypes from 'prop-types';

import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { Avatar, Button, ConfirmModal, Modal } from 'shared/components';

import MemberForm from './MemberForm';
import { TeamSection, TeamHeader, FormHeading, Member, MemberText, MemberName, MemberEmail, MemberActions, YouTag } from './Styles';
import { TEXT } from 'config/text';

const propTypes = {
  users: PropTypes.array.isRequired,
  fetchProject: PropTypes.func.isRequired,
};

/** The people issues can be assigned to. The first one is the signed-in user. */
const Team = ({ users, fetchProject }) => {
  // null = closed, { member: null } = add, { member } = edit
  const [modal, setModal] = useState(null);

  const save = async values => {
    if (modal.member) await api.put(`/users/${modal.member.id}`, values);
    else await api.post('/users', values);
    await fetchProject();
    toast.success(modal.member ? TEXT.team.updated : TEXT.team.added);
  };

  const remove = async (member, confirm) => {
    try {
      await api.delete(`/users/${member.id}`);
      await fetchProject();
      toast.success(TEXT.team.removed(member.name));
    } catch (error) {
      toast.error(error);
    }
    confirm.close();
  };

  return (
    <TeamSection data-testid="team">
      <TeamHeader>
        <FormHeading as="h2">{TEXT.team.title}</FormHeading>
        <Button icon="plus" onClick={() => setModal({ member: null })}>
          {TEXT.team.add}
        </Button>
      </TeamHeader>

      {users.map((member, index) => (
        <Member key={member.id} data-testid={`member:${member.name}`}>
          <Avatar name={member.name} avatarUrl={member.avatarUrl} size={32} />
          <MemberText>
            <MemberName>
              {member.name}
              {index === 0 && <YouTag>{TEXT.team.you}</YouTag>}
            </MemberName>
            <MemberEmail>{member.email}</MemberEmail>
          </MemberText>
          <MemberActions>
            <Button variant="empty" onClick={() => setModal({ member })}>
              {TEXT.common.edit}
            </Button>
            {index > 0 && (
              <ConfirmModal
                variant="danger"
                title={TEXT.team.removeTitle(member.name)}
                message={TEXT.team.removeMessage}
                confirmText={TEXT.team.remove}
                onConfirm={confirm => remove(member, confirm)}
                renderLink={confirm => (
                  <Button variant="empty" icon="trash" onClick={confirm.open} aria-label={TEXT.team.removeLabel(member.name)} />
                )}
              />
            )}
          </MemberActions>
        </Member>
      ))}

      {modal && (
        <Modal
          isOpen
          testid="modal:member"
          width={520}
          withCloseIcon={false}
          onClose={() => setModal(null)}
          renderContent={m => <MemberForm member={modal.member} onSubmit={save} modalClose={m.close} />}
        />
      )}
    </TeamSection>
  );
};

Team.propTypes = propTypes;

export default Team;
