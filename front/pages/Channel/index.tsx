import React, { useCallback } from 'react';
import { Container, Header } from './styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { data: channelsData } = useSWR<IChannel[]>(`/api/workspaces/${workspace}/channels`, fetcher);
  const { data: chatData, mutate } = useSWR<IChat[]>(
    () => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (event: any) => {
      event.preventDefault();
      if (chat.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          })
          .catch(console.error);
      }
    },
    [chat],
  );

  return (
    <Container>
      <Header>Channel</Header>
      <ChatList />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default Channel;
