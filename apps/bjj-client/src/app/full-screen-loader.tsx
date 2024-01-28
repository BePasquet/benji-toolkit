import styled from 'styled-components';

export function FullScreenLoader() {
  return (
    <LoaderContainer>
      <Loader />
    </LoaderContainer>
  );
}

const LoaderContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Loader = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  border: 5px solid #f3f3f3;
  animation: spin 1s linear infinite;
  border-top: 5px solid #555;
  border-radius: 50%;
  width: 50px;
  height: 50px;
`;
