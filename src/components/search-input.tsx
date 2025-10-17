import { SearchIcon } from "@/components/icon";
import { useEffect, useState } from "react";

type SearchInputProps = {
  onFinish: (value: string) => void;
  open?: boolean;
};

const COMPLETE_INPUT_TIME = 1000;

export default function SearchInput({
  open = true,
  onFinish,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & SearchInputProps) {
  const [searchKey, setSearchKey] = useState(
    props.defaultValue?.toString() ?? ""
  );

  const handleInput = (value: string) => {
    setSearchKey(value);
  };

  useEffect(() => {
    const timeId = setTimeout(() => onFinish(searchKey), COMPLETE_INPUT_TIME);

    return () => {
      clearTimeout(timeId);
    };
  }, [searchKey]);
  return (
    <div className="relative text-gray-500 text-sm italic" {...props}>
      <input
        type="text"
        className={`w-full outline-none shadow-sm 
            ${open ? "pr-4 pl-8 py-3 rounded-3xl" : "p-3 rounded-full"}
          `}
        placeholder={open ? "Search here..." : ""}
        defaultValue={searchKey}
        onInput={(e) => handleInput(e.currentTarget.value)}
        readOnly={!open}
      />
      <SearchIcon
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 
            ${open ? "left-2" : "left-1/2 -translate-x-1/2"}`}
      />
    </div>
  );
}
