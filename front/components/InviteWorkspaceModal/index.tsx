import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteWorkspaceModal = ({ show, onCloseModal, setShowInviteWorkspaceModal }: Props) => {
  const [newMember, onChangeNewMember, setNewMemvber] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const onInviteMember = useCallback(
    (event: any) => {
      event.preventDefault();
      if (!newMember || !newMember.trim()) return;
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/members`,
          { email: newMember },
          { withCredentials: true },
        )
        .then(() => {
          setShowInviteWorkspaceModal(false);
          setNewMemvber('');
          mutate(`http://localhost:3095/api/workspaces/${workspace}/members`);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
