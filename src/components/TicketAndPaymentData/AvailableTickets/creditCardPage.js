import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import insertPayment from '../../../hooks/api/usePayment';

export default function CreditCardComponent(props) {
  const { ticketData, ticketId, userId } = props;
  const [includesHotel, setIncludesHotel] = useState('');
  const [isPayed, setIsPayed] = useState(true);
  const { createPayment } = insertPayment;
  const [form, setForm] = useState({
    cvc: '',
    expiry: '',
    name: '',
    number: '',
  });

  useEffect(() => {
    if(ticketData.TicketType.includesHotel === true) { 
      setIncludesHotel(' + Com Hotel');
    };
  
    if(ticketData.TicketType.isRemote === false && ticketData.TicketType.includesHotel === false) { 
      setIncludesHotel(' + Sem Hotel');
    };
  }, []);
  
  function handleForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submitPayment(data) {
    const cardNumberValidation = data.number < 16;
    const nameValidation = data.name.length < 3;
    const expiryValidation = data.expiry.length < 4 || data.expiry.length > 6;
    const cvcValidation = data.cvc.length < 3;

    if (cardNumberValidation) {
      toast('Digite o número correto do Cartão de Crédito');
      return;
    }
    if (nameValidation) {
      toast('Preencha corretamente o nome no Cartão');
      return;
    }
    if (expiryValidation) {
      toast('Preencha corretamente a data de validade');
      return;
    }
    if (cvcValidation) {
      toast('Preencha corretamente os dados de CVC');
      return;
    }

    const issuer = 'visa';
    const dataToInsert = {
      userId,
      ticketId: ticketId,
      cardData: {
        issuer: issuer,
        number: data.number,
        name: data.name,
        expirationDate: data.expiry,
        cvv: data.cvc,
      },
    };

    try {
      await createPayment(dataToInsert);
      setIsPayed(true);
    } catch (error) {
      toast('Erro ao processar o pagamento');
    }
  }

  return (
    <>
      <Title variant="h6" color="textSecondary">
        {'Ingresso Escolhido'}
      </Title>
      
      <TicketCard>
        <StyledTypography variant="body1" color="textPrimary">
          {`${ticketData.TicketType.name}${includesHotel}`}
        </StyledTypography>
        <StyledTypography color="textSecondary">
          {`R$ ${ticketData.TicketType.price}`}
        </StyledTypography>
      </TicketCard>
      <Title variant="h6" color="textSecondary">
        {'Pagamento'}
      </Title>
      <PaymentFormBox>
        <Cards
          cvc={form.cvc}
          expiry={form.expiry}
          focused={form.focus}
          name={form.name}
          number={form.number}
          issuer="visa"
        />
        <form>
          <Topbox>
            <input
              type="tel"
              name="number"
              placeholder="Card Number"
              onChange={handleForm}
              value={form.description}
              maxLength="16"
            />
            <StyledTypography variant="body2" color="textSecondary">
              {'E.g.: 49...,51...,36...,37...'}
            </StyledTypography>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleForm}
              value={form.description}
              width="5px"
            />
          </Topbox>
          <InnerBox>
            <ExpiryInput
              type="text"
              name="expiry"
              maxLength="4"
              mask="00/00"
              placeholder="Valid Thru"
              onChange={handleForm}
              value={form.description}
            />
            <CvcInput
              type="cvc"
              name="cvc"
              placeholder="CVC"
              maxLength="4"
              onChange={handleForm}
              value={form.description}
            />
          </InnerBox>
        </form>
      </PaymentFormBox>
      <Button onClick={() => {
        submitPayment(form);
      }}>
        <StyledTypography>
          {'Finalizar Pagamento'}
        </StyledTypography>
      </Button>
    </>
  );
}

const StyledTypography = styled(Typography)`
`;

const Title = styled(Typography)`
  margin-top: 30px !important;
  margin-bottom: 10px !important;
`;

const PaymentFormBox = styled.div`
  display: flex;
  padding-right: 50px;
  width: 650px;
  form {
    margin-left: 18px;
  }
  input {
    border: 1px solid #cecece;
    height: 40px;
    margin-top: 8px;
    border-radius: 8px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: start;
    color: #454545;
    padding-left: 10px;
    color: gray;
  }
`;

const TicketCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 290px;
  height: 108px;
  border: 1px solid #cecece;
  border-radius: 20px;
  background-color: #ffeed2;

`;

const Topbox = styled.div`
  width: 290px;
  input {
    width: 100%;
  }
`;

const InnerBox = styled.div`
  width: 290px;
  display: flex;
  justify-content: space-between;
`;
const ExpiryInput = styled.input`
  width: 60%;
`;
const CvcInput = styled.input`
  width: 30%;
`;
const Button = styled.button`
  background-color: #e5e5e5;
  border-radius: 6px;
  margin-top: 35px;
  width: 182px;
  height: 37px;
  box-shadow: 1px 1px 8px 2px #888888;

`;
