import React, { Ref, useCallback, useEffect, useRef } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import Scrollbars, { positionValues } from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: IDM[] };
  scrollbarRef: React.RefObject<Scrollbars | null>;
  setSize: (size: number | ((_size: number) => number)) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = ({ chatSections, scrollbarRef, setSize, isEmpty, isReachingEnd }: Props) => {
  const onScroll = useCallback((values: positionValues) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      setSize((pre) => pre + 1).then(() => {
        setTimeout(() => {
          scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
        }, 50);
      });
    }
  }, []);

  useEffect(() => {});

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
