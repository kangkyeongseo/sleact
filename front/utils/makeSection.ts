import { IDM } from '@typings/db';
import dayjs from 'dayjs';

export default function makeSection(chatlist: IDM[]) {
  const sections: { [key: string]: IDM[] } = {};
  chatlist.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
