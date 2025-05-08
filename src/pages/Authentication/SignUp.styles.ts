import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const SideImage = styled.div`
  display: none;

  @media (min-width: 1280px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    background: #f4f4f4;
    padding: 3rem;
  }

  p {
    font-size: 1.25rem;
    color: #333;
    font-weight: 500;
    text-align: center;
    max-width: 300px;
  }

  svg {
    max-width: 100%;
    height: auto;
  }
`;

export const FormSection = styled.div`
  width: 100%;
  padding: 2rem;

  @media (min-width: 1280px) {
    width: 50%;
    padding: 4rem;
    border-left: 1px solid #e5e7eb;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #1c2434;
  }

  form > div {
    margin-bottom: 1.25rem;
  }

  label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
    color: #1c2434;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #cbd5e0;
    outline: none;
    transition: border 0.2s;

    &:focus {
      border-color: #3056d3;
    }
  }

  button {
    margin-top: 1.5rem;
    width: 100%;
    padding: 0.75rem;
    background: #3056d3;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background: #2346b0;
    }
  }

  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
`;
