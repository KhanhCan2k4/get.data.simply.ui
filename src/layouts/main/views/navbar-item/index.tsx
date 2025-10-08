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
  return (
    <div
      className={`bg-white flex items-center p-2 justify-center gap-2 cursor-pointer transition-all duration-500 hover:bg-gray-50 rounded-full ${
        active && "text-blue-400"
      }`}
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
    </div>
  );
}
