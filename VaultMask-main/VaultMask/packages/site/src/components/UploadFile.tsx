import { ComponentProps } from 'react';
import styled from 'styled-components';

const UploadFile = styled.input.attrs(() => ({
  id: 'upload-btn',
  type: 'file',
}))`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  margin-bottom: auto;
  padding: 1rem;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

const SubmitFile = styled.input.attrs(() => ({
  id: 'submit-btn',
  type: 'submit',
}))`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  margin-bottom: auto;
  padding: 1rem;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

export const UploadFileInput = (props: ComponentProps<typeof UploadFile>) => {
  return <UploadFile {...props} />;
};

export const UploadFileContent = (props: ComponentProps<typeof SubmitFile>) => {
  return <SubmitFile {...props} />;
};