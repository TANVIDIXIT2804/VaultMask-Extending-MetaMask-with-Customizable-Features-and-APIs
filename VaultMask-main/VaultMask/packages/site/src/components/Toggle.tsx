import { useState } from 'react';
import styled from 'styled-components';

type CheckedProps = {
  readonly checked: boolean;
};

const ToggleWrapper = styled.div`
  touch-action: pan-x;
  display: inline-block;
  position: relative;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  padding: 0;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  margin-right: 0rem;
  ${({ theme }) => theme.mediaQueries.small} {
    margin-right: 0rem;
  }
`;

const ToggleInput = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

const IconContainer = styled.div`
  position: absolute;
  width: 11px;
  height: 11px;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  line-height: 0;
  opacity: 0;
  transition: opacity 0.25s ease;
  & > * {
    align-items: center;
    display: flex;
    height: 11px;
    justify-content: center;
    position: relative;
    width: 11px;
  }
`;

const CheckedContainer = styled(IconContainer) <CheckedProps>`
  opacity: ${({ checked }) => (checked ? 1 : 0)};
  left: 5px;
`;

const UncheckedContainer = styled(IconContainer) <CheckedProps>`
  opacity: ${({ checked }) => (checked ? 0 : 1)};
  right: 5px;
`;

const ToggleContainer = styled.div`
  width: 34px;
  height: 18px;
  padding: 0;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.colors.background.alternative};
  transition: all 0.2s ease;
`;
const ToggleCircle = styled.div<CheckedProps>`
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  position: absolute;
  top: 2px;
  left: ${({ checked }) => (checked ? '18px' : '2px')};
  width: 14px;
  height: 14px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.14);
  border-radius: 50%;
  background-color: #ffffff;
  box-sizing: border-box;
  transition: all 0.25s ease;
`;

export const Toggle = ({
  onToggle,
  defaultChecked = false,
}: {
  onToggle(): void;
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    onToggle();
    setChecked(!checked);
  };

  return (
    <ToggleWrapper onClick={handleChange}>
      <ToggleContainer>
        <CheckedContainer checked={checked}>
          <span>🌞</span>
        </CheckedContainer>
        <UncheckedContainer checked={checked}>
          <span>🌜</span>
        </UncheckedContainer>
      </ToggleContainer>
      <ToggleCircle checked={checked} />
      <ToggleInput type="checkbox" aria-label="Toggle Button" />
    </ToggleWrapper>
  );
};
