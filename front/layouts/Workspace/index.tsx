import React, { lazy } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';

const Workspace = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, { dedupingInterval: 2000 });

  const onLogout = () => {
    axios
      .post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
      .then((response) => {
        mutate(false, false);
      })
      .catch(() => {});
  };

  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <ProfileImg src={gravatar.url(data.nickname, { s: '28px', d: 'retro' })} alt={data.nickname} />
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Outlet />
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
