import React, { useCallback, useEffect, useRef } from 'react';
import autosize from 'autosize';
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from './styles';
import { Mention, SuggestionDataItem, SuggestionFunc } from 'react-mentions';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';
import gravatar from 'gravatar';

interface Props {
  chat: string;
  onSubmitForm: (event: any) => void;
  onChangeChat: (event: any) => void;
  placeholder?: string;
}

const ChatBox = ({ chat, onSubmitForm, onChangeChat, placeholder }: Props) => {
  const { workspace } = useParams<{ workspace: string }>();

  const { data: userData } = useSWR('/api/users', fetcher);
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const onKeydownChat = useCallback(
    (evevt: any) => {
      if (evevt.key === 'Enter') {
        if (!evevt.shiftKey) {
          evevt.preventDefault();
          onSubmitForm(evevt);
        }
      }
    },
    [onSubmitForm],
  );

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focused: boolean,
    ): React.ReactNode => {
      if (!memberData) return;

      return (
        <EachMention focused={focused}>
          <img
            src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          forceSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((data) => ({ id: data.id, display: data.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
