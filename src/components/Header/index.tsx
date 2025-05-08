import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import DarkModeSwitcher from './DarkModeSwitcher';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/authService';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [, setCompanyName] = useState<string>('Empresa Desconhecida');
  const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
  const [personInfo, setPersonInfo] = useState<{
    name: string;
    role: string;
    avatar_url: string | null;
  } | null>(null);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>(
    [],
  );
  const user = useUser();

  useEffect(() => {
    const fetchHeaderData = async () => {
      if (!user?.id) return;

      const { data: personData, error: personError } = await supabase
        .from('persons')
        .select('id, first_name, avatar_url, active_company_id')
        .eq('auth_user_id', user.id)
        .single();

      if (personError || !personData) return;

      const { data: accessData, error: accessError } = await supabase
        .from('person_company_access')
        .select('company_id, role, companies ( id, name )')
        .eq('person_id', personData.id);

      if (accessError || !accessData) return;

      const companyList = accessData.map((a: any) => ({
        id: a.companies.id,
        name: a.companies.name,
      }));

      setCompanies(companyList);

      const active =
        accessData.find(
          (a: any) => a.company_id === personData.active_company_id,
        ) || accessData[0];

      setActiveCompanyId(active.company_id);

      setPersonInfo({
        name: personData.first_name,
        role: active.role || '',
        avatar_url: personData.avatar_url,
      });

      if (
        !personData.active_company_id ||
        personData.active_company_id !== active.company_id
      ) {
        await supabase
          .from('persons')
          .update({ active_company_id: active.company_id })
          .eq('auth_user_id', user.id);
      }
    };

    fetchHeaderData();
  }, [user?.id]);

  const handleCompanyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newCompanyId = Number(e.target.value);
    const newCompany = companies.find((c) => c.id === newCompanyId);
    if (!newCompany || !user?.id) return;

    await supabase
      .from('persons')
      .update({ active_company_id: newCompanyId })
      .eq('auth_user_id', user.id);

    setCompanyName(newCompany.name);
    setActiveCompanyId(newCompanyId);
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        {/* Botão Hamburguer */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && `!w-full delay-${i * 150}`
                    }`}
                  ></span>
                ))}
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
        </div>

        {/* Dropdown de empresas */}
        <div className="hidden sm:flex flex-col text-sm text-black dark:text-white">
          <select
            className="text-black dark:text-white font-medium bg-transparent"
            value={activeCompanyId ?? ''}
            onChange={handleCompanyChange}
          >
            {companies.map((company) => (
              <option
                key={company.id}
                value={company.id}
                className="text-black"
              >
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Avatar com nome e role + ícones */}
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
            <DropdownMessage />
          </ul>

          <div className="relative flex items-center gap-4 cursor-pointer group">
            <DropdownUser
              name={personInfo?.name || 'Usuário'}
              role={personInfo?.role || ''}
              avatarUrl={
                personInfo?.avatar_url
                  ? `${personInfo.avatar_url}?t=${new Date().getTime()}`
                  : null
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
