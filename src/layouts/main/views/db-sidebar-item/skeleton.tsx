import { DatabaseIcon } from "@/components/icon";
import NavbarItemSkeleton from "../navbar-item/skeleton";

type DBSideBarItemSkeletonProps = {
  open: boolean;
};

export default function DBSideBarItemSkeleton({ open }: DBSideBarItemSkeletonProps) {
  return (
    <>
      <NavbarItemSkeleton
        open={open}
        icon={<DatabaseIcon className="text-gray-200 w-5 h-5" />}
        className="bg-gray-50 rounded-3xl flex items-center justify-center gap-2 cursor-wait"
      />
    </>
  );
}
