type AvatarProps = {
  name: string;
};

export default function Avatar(
  attributes: React.HTMLAttributes<HTMLSpanElement> & AvatarProps
) {
  const display = attributes.name
    .split(" ")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() : w))
    .join("");
  return (
    <span
      {...attributes}
      className={`size-14 bg-blue-200 text-blue-500 rounded-full shadow-sm p-2 flex items-center justify-center text-xl ${attributes.className}`}
    >
      {display}
    </span>
  );
}
