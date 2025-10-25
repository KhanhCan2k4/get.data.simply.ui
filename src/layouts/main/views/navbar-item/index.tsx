import { MenuIcon } from "@/components/icon";
import { useLocation, useNavigate } from "react-router-dom";

type NavbarItemProps = {
  icon: string | React.JSX.Element;
  displayName: string;
  path: string;
  open: boolean;
};

export default function NavbarItem({
  icon,
  path,
  open,
  displayName,
  ...rest
}: NavbarItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname.includes(path);

  const handleMenuClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (rest.onContextMenu) {
      rest.onContextMenu(e);
    }
  };

  return (
    <div
      className={`flex items-center p-2 justify-center gap-2 cursor-pointer transition-all duration-100 hover:bg-gray-50
        ${active ? "text-blue-400 bg-gray-50" : "bg-white"}
        `}
      onClick={() => navigate(path)}
      {...rest}
    >
      <div className={`rounded-full p-4 shadow-sm`}>
        {typeof icon === "string" ? (
          <img src={icon} alt="Nav Icon" className="w-8 h-8" />
        ) : (
          icon
        )}
      </div>
      <span className={`font-semibold min-w-[150px] ${!open && "hidden"}`}>
        {displayName}
      </span>
      {rest.onContextMenu && (
        <div className="cursor-pointer" onClick={handleMenuClick}>
          <MenuIcon className="size-4 mr-4" />
        </div>
      )}
    </div>
  );
}
