import { useEffect, useState } from "react";

type LocalData<T> = {
  modifiedAt: Date;
  data: T;
};

export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<LocalData<T> | undefined>(
    defaultValue
      ? {
          modifiedAt: new Date(),
          data: defaultValue,
        }
      : undefined
  );

  useEffect(() => {
    const rawJsonValue = window.localStorage.getItem(key);

    if (rawJsonValue) {
      const convertedObj =
        (JSON.parse(rawJsonValue) as LocalData<T>) ?? undefined;

      if (convertedObj) {
        setValue(convertedObj);
      }
    }
  }, [key]);

  const saveValue = (value: T) => {
    const newData = {
      data: value,
      modifiedAt: new Date(),
    };
    setValue(newData);
    window.localStorage.setItem(key, JSON.stringify(newData));
  };

  return { value, saveValue };
}
