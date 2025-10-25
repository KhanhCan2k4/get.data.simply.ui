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
      <Skeleton
        circle
        height={48}
        width={48}
        className="bg-gray-500 rounded-full m-2 mr-0 shadow-sm"
      />

      {open && (
        <Skeleton
          width={150}
          height={24}
          borderRadius={24} 
          className="bg-gray-500"
        />
      )}

      <Skeleton
        width={30}
        height={24}
        borderRadius={24}
        className="mr-3 bg-gray-500"
      />
    </div>
  );
}
