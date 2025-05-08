// src/pages/Suppliers.tsx
import React, { useState } from 'react';
import { Button, Drawer, Form, Input } from 'antd';
import { useSuppliers } from '../hooks/useSuppliers';
import CardDataStats from '../components/CardDataStats';
import { supabase } from '../lib/supabaseClient';
import SuppliersTable from '../components/Tables/SuppliersTable';

const Suppliers: React.FC = () => {
  const { suppliers, refetch } = useSuppliers();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddSupplier = async (values: any) => {
    const { error } = await supabase.from('suppliers').insert([values]);
    if (!error) {
      form.resetFields();
      setDrawerOpen(false);
      refetch();
    } else {
      console.error('Erro ao adicionar fornecedor:', error.message);
    }
  };

  return (
    <>
      {/* Mini dashboard */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:gap-7.5 mb-6">
        <CardDataStats
          title="Fornecedores cadastrados"
          total={suppliers.length.toString()}
          rate="+100%"
          levelUp
        >
          <></>
        </CardDataStats>
        <CardDataStats title="Ativos este mês" total="12" rate="+12%" levelUp>
          <></>
        </CardDataStats>
        <CardDataStats title="Com orçamento" total="5" rate="-8%" levelDown>
          <></>
        </CardDataStats>
        <CardDataStats
          title="Com serviços realizados"
          total="7"
          rate="+4%"
          levelUp
        >
          <></>
        </CardDataStats>
      </div>

      {/* Botão e tabela */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Fornecedores</h2>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>
          Novo Fornecedor
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <SuppliersTable suppliers={suppliers} />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="bg-white shadow rounded p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">Resumo</h2>
            <p>
              Total de fornecedores ativos: <strong>{suppliers.length}</strong>
            </p>
            <p>
              Último cadastro:{' '}
              <strong>
                {suppliers[0]?.created_at?.split('T')[0] ?? '---'}
              </strong>
            </p>
          </div>
        </div>
      </div>

      <Drawer
        title="Novo Fornecedor"
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Form layout="vertical" form={form} onFinish={handleAddSupplier}>
          <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
            <Input placeholder="Nome do fornecedor" />
          </Form.Item>
          <Form.Item name="document" label="Documento">
            <Input placeholder="CNPJ ou CPF" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Email do fornecedor" />
          </Form.Item>
          <Form.Item name="phone" label="Telefone">
            <Input placeholder="Telefone" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Salvar Fornecedor
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default Suppliers;
