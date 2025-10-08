export default function BadgeButton(
  props: React.HTMLAttributes<HTMLButtonElement> & React.PropsWithChildren
) {
  return (
    <span
      {...props}
      className={`shadow-sm rounded-full py-2 px-4 text-sm cursor-pointer hover:bg-blue-400 hover:text-white transition-colors duration-200 ${props.className}`}
    >
      {props.children}
    </span>
  );
}
