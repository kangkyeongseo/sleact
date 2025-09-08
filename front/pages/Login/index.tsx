import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { Link, Navigate } from 'react-router';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';

const Login = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, { dedupingInterval: 2000 });
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLogInError(false);
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          mutate(response.data, false);
        })
        .catch((error) => {
          setLogInError(error.response.status === 401);
        })
        .finally(() => {});
    },
    [email, password, mutate],
  );

  if (data === undefined) {
    return <div>loading...</div>;
  }

  if (data) {
    return <Navigate to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Login;
