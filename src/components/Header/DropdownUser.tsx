import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';

type Props = {
  name: string;
  role: string;
  avatarUrl: string | null;
};

const DropdownUser = ({ name, role, avatarUrl }: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4 cursor-pointer group"
      >
        <div className="text-right hidden lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {name}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {role}
          </span>
        </div>

        <span className="h-10 w-10 rounded-full">
          <img
            src={avatarUrl || '/default-avatar.png'}
            alt="User Avatar"
            className="rounded-full object-cover h-10 w-10"
          />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.41 0.91C0.74 0.59 1.26 0.59 1.59 0.91L6 5.32L10.41 0.91C10.74 0.59 11.26 0.59 11.59 0.91C11.91 1.24 11.91 1.76 11.59 2.09L6.59 7.09C6.26 7.41 5.74 7.41 5.41 7.09L0.41 2.09C0.09 1.76 0.09 1.24 0.41 0.91Z"
            fill=""
          />
        </svg>
      </div>

      {/* Dropdown Start */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-64 rounded-sm border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col gap-4 border-b border-stroke px-6 py-6 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium hover:text-primary"
              >
                Perfil
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3.5 text-sm font-medium hover:text-primary"
              >
                Configurações
              </Link>
            </li>
          </ul>
          <button className="w-full px-6 py-4 text-left text-sm font-medium hover:text-primary">
            Sair
          </button>
        </div>
      )}
      {/* Dropdown End */}
    </ClickOutside>
  );
};

export default DropdownUser;
