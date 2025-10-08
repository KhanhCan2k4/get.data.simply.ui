import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type MsgSideBarItemSkeletonProps = {
  open: boolean;
};

export default function MsgSideBarItemSkeleton({
  open,
}: MsgSideBarItemSkeletonProps) {
  return (
    <div className={`flex items-center gap-2 p-2 cursor-pointer rounded-full`}>
      <Skeleton circle height={48} width={48} className="bg-gray-500" />
      {open && (
        <>
          <div className={`flex-1 flex flex-col gap-2 break-words min-w-20`}>
            <Skeleton
              width={150}
              height={24}
              borderRadius={24}
              className="mr-3 bg-gray-500"
            />
            <Skeleton
              width={150}
              height={18}
              borderRadius={18}
              className="mr-3 bg-gray-500"
            />
          </div>

          <Skeleton
            width={50}
            height={10}
            borderRadius={10}
            className="mr-3 bg-gray-500"
          />

          <Skeleton circle height={10} width={10} className="bg-gray-500" />
        </>
      )}
    </div>
  );
}
