import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignUp from './pages/Authentication/SignUp';
import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Company from './pages/Company/Company';
import Profile from './pages/Profile/Profile';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Budget from './pages/Budget';
import Suppliers from './pages/Suppliers';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />

      {/* Rotas privadas com layout */}
      <Route path="/" element={<DefaultLayout />}>
        <Route
          index
          element={
            <>
              <PageTitle title="eCommerce Dashboard" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/budget"
          element={
            <>
              <PageTitle title="Orçamento" />
              <Budget />
            </>
          }
        />
        <Route
          path="/suppliers"
          element={
            <>
              <PageTitle title="Fornecedores" />
              <Suppliers />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendário" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/company"
          element={
            <>
              <PageTitle title="Company" />
              <Company />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Elementos de Formulário" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Layout de Formulário" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tabelas" />
              <Tables />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Perfil" />
              <Profile />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Gráfico" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alertas" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Botões" />
              <Buttons />
            </>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
