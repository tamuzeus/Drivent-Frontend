import styled from 'styled-components';

export default function ChangeBookingButton({ booked, booking, setBooked }) {
  return (
    <StyledButton onClick={() => {setBooked(booking);}}>
      <StyledButtonText>TROCAR DE QUARTO</StyledButtonText>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  cursor: pointer;
  margin-top: 38px;
  padding: 0 12px;
  height: 37px;
  background: #e0e0e0;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  border-color: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButtonText = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #000000;
`;
