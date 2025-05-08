import { useEffect, useMemo, useState } from 'react';
import {
  Drawer,
  Form,
  Select,
  Button,
  InputNumber,
  Card,
  Table,
  message,
} from 'antd';
import { PlusOutlined, SmallDashOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { supabase } from '../../lib/supabaseClient';
import { useBudgetEntries } from '../../hooks/useBudgetEntries';
import { useBudgetCategories } from '../../hooks/useBudgetCategories';
import { useBudgetGroups } from '../../hooks/useBudgetGroups';
import { useBudgetItems } from '../../hooks/useBudgetItems';
import { useSuppliers } from '../../hooks/useSuppliers';

interface BudgetItem {
  key: number;
  mes: string;
  categoria: string;
  grupo: string;
  item: string;
  orcado: number;
  realizado: number;
  supplier_id: number | null;
}

const BudgetDashboard = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear().toString(),
  );
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>();
  const [grupoSelecionado, setGrupoSelecionado] = useState<number>();
  const [itemSelecionado, setItemSelecionado] = useState<number>();
  const [activeCompanyId, setActiveCompanyId] = useState<number | undefined>();
  const [, setIsCompanyLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCompanyId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) {
        setIsCompanyLoading(false);
        return;
      }

      const { data: person } = await supabase
        .from('persons')
        .select('active_company_id')
        .eq('auth_user_id', user.id)
        .single();

      if (person?.active_company_id) {
        setActiveCompanyId(person.active_company_id);
      }

      setIsCompanyLoading(false);
    };

    fetchActiveCompanyId();
  }, []);

  const { categories } = useBudgetCategories(activeCompanyId);
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.name === categoriaSelecionada),
    [categories, categoriaSelecionada],
  );
  const { groups } = useBudgetGroups(
    selectedCategory?.id ?? 0,
    activeCompanyId,
  );
  const { items } = useBudgetItems(grupoSelecionado ?? 0, activeCompanyId);
  const { suppliers } = useSuppliers();

  const {
    data: budgets,
    resumoPorMes,
    loading,
    refetch,
  } = useBudgetEntries({
    year: anoSelecionado,
    category_name: categoriaSelecionada,
    group_id: grupoSelecionado,
    item_id: itemSelecionado,
    company_id: activeCompanyId,
  });

  const monthNames = [
    '',
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const totalOrcado = budgets.reduce((acc, b) => acc + b.planned_value, 0);
  const totalRealizado = budgets.reduce(
    (acc, b) => acc + (b.actual_value ?? 0),
    0,
  );
  const diferenca = totalOrcado - totalRealizado;

  const data = budgets.map((entry) => ({
    key: entry.id,
    mes: monthNames[entry.month],
    categoria: entry.category_name,
    grupo: entry.group_name,
    item: entry.item_name,
    orcado: entry.planned_value,
    realizado: entry.actual_value ?? 0,
    supplier_id: entry.supplier_id,
  }));

  const columns: ColumnsType<BudgetItem> = [
    { title: 'Mês', dataIndex: 'mes', key: 'mes' },
    { title: 'Categoria', dataIndex: 'categoria', key: 'categoria' },
    { title: 'Grupo', dataIndex: 'grupo', key: 'grupo' },
    { title: 'Item', dataIndex: 'item', key: 'item' },
    {
      title: 'Orçado',
      dataIndex: 'orcado',
      key: 'orcado',
      render: (v) =>
        v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
    {
      title: 'Realizado',
      dataIndex: 'realizado',
      key: 'realizado',
      render: (v) =>
        v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, record) => (
        <Button
          icon={<SmallDashOutlined />}
          onClick={() => {
            setEditingId(record.key);
            editForm.setFieldsValue({
              actual_value: record.realizado,
              supplier_id: record.supplier_id ?? undefined,
            });
            setEditDrawerVisible(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Orçamento</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setDrawerVisible(true)}
        >
          Novo Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card title="Orçado">R$ {totalOrcado.toFixed(2)}</Card>
        <Card title="Realizado">R$ {totalRealizado.toFixed(2)}</Card>
        <Card
          title="Diferença"
          className={diferenca >= 0 ? 'text-green-600' : 'text-red-600'}
        >
          R$ {diferenca.toFixed(2)}
        </Card>
      </div>

      <div className="flex gap-4 mb-4 flex-wrap">
        <Select
          value={anoSelecionado}
          onChange={setAnoSelecionado}
          placeholder="Ano"
          options={['2025', '2024', '2023'].map((y) => ({
            label: y,
            value: y,
          }))}
          className="w-32"
        />
        <Select
          value={categoriaSelecionada}
          onChange={setCategoriaSelecionada}
          placeholder="Categoria"
          allowClear
          options={categories.map((c) => ({ value: c.name, label: c.name }))}
          className="w-48"
        />
        <Select
          value={grupoSelecionado}
          onChange={setGrupoSelecionado}
          placeholder="Grupo"
          allowClear
          options={groups.map((g) => ({ value: g.id, label: g.name }))}
          className="w-48"
        />
        <Select
          value={itemSelecionado}
          onChange={setItemSelecionado}
          placeholder="Item"
          allowClear
          options={items.map((i) => ({ value: i.id, label: i.name }))}
          className="w-48"
        />
        <Button
          onClick={() => {
            setAnoSelecionado(new Date().getFullYear().toString());
            setCategoriaSelecionada(undefined);
            setGrupoSelecionado(undefined);
            setItemSelecionado(undefined);
          }}
        >
          Limpar Filtros
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {resumoPorMes.map((m) => (
          <Card key={m.mes} title={m.label}>
            <p>
              <strong>Orçado:</strong>{' '}
              {m.orcado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
            <p>
              <strong>Realizado:</strong>{' '}
              {m.realizado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </Card>
        ))}
      </div>

      <Table dataSource={data} columns={columns} loading={loading} />

      {/* Drawer de novo orçamento */}
      <Drawer
        title="Novo Orçamento"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            if (!activeCompanyId) return;
            const { error } = await supabase.from('budget_entries').insert({
              ...values,
              company_id: activeCompanyId,
            });

            if (!error) {
              setDrawerVisible(false);
              form.resetFields();
              await refetch();
              message.success('Orçamento adicionado com sucesso!');
            }
          }}
        >
          <Form.Item label="Ano" name="year" rules={[{ required: true }]}>
            <Select
              options={['2025', '2024', '2023'].map((y) => ({
                value: parseInt(y),
                label: y,
              }))}
            />
          </Form.Item>

          <Form.Item label="Mês" name="month" rules={[{ required: true }]}>
            <Select
              options={monthNames
                .slice(1)
                .map((label, index) => ({ value: index + 1, label }))}
            />
          </Form.Item>

          <Form.Item
            label="Categoria"
            name="category_id"
            rules={[{ required: true }]}
          >
            <Select
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Grupo" name="group_id">
            <Select
              options={groups.map((g) => ({
                value: g.id,
                label: g.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Item" name="item_id">
            <Select
              options={items.map((i) => ({
                value: i.id,
                label: i.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Valor Orçado"
            name="planned_value"
            rules={[{ required: true }]}
          >
            <InputNumber prefix="R$" min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Valor Realizado" name="actual_value">
            <InputNumber prefix="R$" min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Fornecedor" name="supplier_id">
            <Select
              options={suppliers.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              allowClear
              placeholder="Selecione o fornecedor"
            />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Drawer de edição */}
      <Drawer
        title="Atualizar orçamento"
        open={editDrawerVisible}
        onClose={() => setEditDrawerVisible(false)}
        width={400}
      >
        <Form
          layout="vertical"
          form={editForm}
          onFinish={async (values) => {
            if (!editingId) return;
            const { error } = await supabase
              .from('budget_entries')
              .update({
                actual_value: values.actual_value,
                supplier_id: values.supplier_id,
              })
              .eq('id', editingId);

            if (!error) {
              setEditDrawerVisible(false);
              await refetch();
              message.success('Atualizado com sucesso');
            }
          }}
        >
          <Form.Item label="Fornecedor" name="supplier_id">
            <Select
              options={suppliers.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              allowClear
              placeholder="Selecione o fornecedor"
            />
          </Form.Item>
          <Form.Item
            label="Valor Realizado"
            name="actual_value"
            rules={[{ required: true }]}
          >
            <InputNumber prefix="R$" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default BudgetDashboard;
