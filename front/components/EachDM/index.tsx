import React from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useLocation } from 'react-router';
import { useParams, NavLink } from 'react-router';
import { IUser } from '@typings/db';

interface Props {
  member: IUser;
  isOnline: boolean;
}

const EachDM = ({ member, isOnline }: Props) => {
  const { workspace } = useParams<{ workspace: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  return (
    <NavLink to={`/workspace/${workspace}/dm/${member.id}`}>
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      />
      <span className={count && count > 0 ? 'bold' : undefined}>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {(count && count > 0 && <span className="count">{count}</span>) || null}
    </NavLink>
  );
};

export default EachDM;
