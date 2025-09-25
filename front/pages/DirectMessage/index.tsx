import React, { Ref, useCallback, useEffect, useRef } from 'react';
import { Container, Header } from './styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { IDM } from '@typings/db';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  if (!workspace) return;

  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0].length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1].length < 20) || false;
  const scrollbarRef: React.RefObject<Scrollbars | null> = useRef(null);

  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!chat?.trim() || !myData || !userData) return;

      const savedChat = chat;
      setChat('');

      const newChat = {
        id: (chatData?.[0][0]?.id || 0) + 1,
        content: savedChat,
        SenderId: myData.id,
        Sender: myData,
        ReceiverId: userData.id,
        Receiver: userData,
        createdAt: new Date(),
      };

      // 기존 캐시 복사 후 새 메시지 추가
      const newData = chatData && chatData.length > 0 ? [[newChat, ...chatData[0]], ...chatData.slice(1)] : [[newChat]];

      // 캐시에 바로 optimistic 데이터 넣기
      mutateChat(newData, false).then(() => {
        // false = revalidate 안 함
        scrollbarRef.current?.scrollToBottom();
      });

      // 실제 서버 요청
      axios
        .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
          content: savedChat,
        })
        .then(() => {
          // 성공 후 서버 데이터 다시 가져오기
          mutateChat(); // true by default
        })
        .catch(console.error);
    },
    [chat, chatData, myData, userData, workspace, id, setChat, mutateChat],
  );

  const onMessage = useCallback((data: IDM) => {
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      const newData = chatData && chatData.length > 0 ? [[data, ...chatData[0]], ...chatData.slice(1)] : [[data]];

      mutateChat(newData, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current?.getScrollHeight() <
            scrollbarRef.current?.getClientHeight() + scrollbarRef.current?.getScrollTop() + 150
          ) {
            scrollbarRef.current?.scrollToBottom();
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        scrollbarRef={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default DirectMessage;
