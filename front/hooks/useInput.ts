import { SetStateAction, useCallback, useState } from 'react';

type ReturnType<T = any> = [T, (event: any) => void, React.Dispatch<SetStateAction<T>>];

const useInput = <T = any>(initialData: T): ReturnType<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((event: any) => {
    setValue(event.target.value);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
