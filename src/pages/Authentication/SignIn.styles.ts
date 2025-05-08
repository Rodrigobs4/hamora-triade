// src/pages/Authentication/SignIn.styles.ts
import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #1e3c72, #2a5298);
`;

export const FormWrapper = styled.div`
  background: #ffffff;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  color: #1e3c72;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    border-color: #2a5298;
    outline: none;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #1e3c72;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #16315f;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  text-align: center;
`;

export const ForgotPasswordLink = styled.a`
  display: block;
  text-align: right;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #2a5298;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #1e3c72;
  }
`;
