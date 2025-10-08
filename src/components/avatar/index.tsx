type AvatarProps = {
  name: string;
};

export default function Avatar(
  attributes: React.HTMLAttributes<HTMLImageElement> & AvatarProps
) {
  return (
    <img
      src={`https://avatar.iran.liara.run/username?username=${attributes.name}`}
      alt="Avatar"
      {...attributes}
    />
  );
}
