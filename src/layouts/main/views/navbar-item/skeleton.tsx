import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type NavbarItemProps = {
  icon: string | React.JSX.Element;
  open: boolean;
};

export default function NavbarItemSkeleton({
  icon,
  open,
  ...rest
}: NavbarItemProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center justify-center gap-2 cursor-pointer rounded-3xl`}
      {...rest}
    >
      <div className={`rounded-full p-4 shadow-sm`}>
        <Skeleton circle height={24} width={24} className="bg-gray-500" />
      </div>
      {open && (
        <Skeleton
          width={150}
          height={24}
          borderRadius={24}
          className="mr-3 bg-gray-500"
        />
      )}
    </div>
  );
}
