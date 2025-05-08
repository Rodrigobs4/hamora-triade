import React from 'react';
import { Supplier } from '../../hooks/useSuppliers';
import SupplierIcon from '../../images/brand/brand-05.svg'; // coloque aqui seu ícone real

interface Props {
  suppliers: Supplier[];
}

const SuppliersTable: React.FC<Props> = ({ suppliers }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-full">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Fornecedores Cadastrados
      </h4>

      <div className="flex flex-col overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-4">
            <h5 className="text-sm font-medium uppercase">Nome</h5>
          </div>
          <div className="p-2.5 xl:p-4 text-center">
            <h5 className="text-sm font-medium uppercase">Telefone</h5>
          </div>
          <div className="p-2.5 xl:p-4 text-center">
            <h5 className="text-sm font-medium uppercase">Cadastro</h5>
          </div>
        </div>

        {suppliers.map((supplier, key) => (
          <div
            key={supplier.id}
            className={`grid grid-cols-1 sm:grid-cols-3 items-center ${
              key === suppliers.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-4">
              <img
                src={SupplierIcon}
                alt="Fornecedor"
                className="w-6 h-6 shrink-0"
              />
              <p className="text-black dark:text-white break-words">
                {supplier.name}
              </p>
            </div>

            <div className="text-center p-2.5 xl:p-4">
              <p className="text-black dark:text-white break-words">
                {supplier.phone || '---'}
              </p>
            </div>

            <div className="text-center p-2.5 xl:p-4">
              <p className="text-meta-5">
                {supplier.created_at
                  ? new Date(supplier.created_at).toLocaleDateString('pt-BR')
                  : '---'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuppliersTable;
