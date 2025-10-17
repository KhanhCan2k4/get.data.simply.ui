type KeyProps = {
  name: string;
};

export default function Key({ name }: KeyProps) {
  return (
    <span className="bg-gray-100 p-1 rounded-sm text-gray-900 text-xs">
      {name}
    </span>
  );
}
