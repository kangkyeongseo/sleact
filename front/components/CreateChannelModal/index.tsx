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
  setShowCreateChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }: Props) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const onCreateChannel = useCallback(
    (event: any) => {
      event.preventDefault();
      if (!newChannel || !newChannel.trim()) return;
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          { name: newChannel },
          { withCredentials: true },
        )
        .then(() => {
          setShowCreateChannelModal(false);
          setNewChannel('');
          mutate(`http://localhost:3095/api/workspaces/${workspace}/channels`);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
