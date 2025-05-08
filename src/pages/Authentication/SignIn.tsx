import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail } from '../../services/authService';
import { ForgotPasswordLink } from './SignIn.styles';

import {
  Container,
  FormWrapper,
  Title,
  Label,
  Input,
  Button,
  ErrorMessage,
} from './SignIn.styles';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email, password);
      navigate('/'); // redirecionar para dashboard
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Bem-vindo de volta</Title>
        <form onSubmit={handleLogin}>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <ForgotPasswordLink href="/auth/forgot-password">
            Esqueci minha senha
          </ForgotPasswordLink>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default SignIn;
