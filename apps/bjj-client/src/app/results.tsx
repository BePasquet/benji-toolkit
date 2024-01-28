import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Loader } from './full-screen-loader';


export interface ResultsProps {
  loading: boolean;
  error: string;
}

export function Results({
  loading,
  error,
  children,
}: PropsWithChildren<ResultsProps>) {
  if (error) {
    return (
      <CenterContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </CenterContainer>
    );
  }

  if (loading) {
    return (
      <CenterContainer>
        <Loader />
      </CenterContainer>
    );
  }

  return children;
}

export const CenterContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const ErrorMessage = styled.h1`
  margin: 0;
  font-size: 16px;
  color: #111;
`;
