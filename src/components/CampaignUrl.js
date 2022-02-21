import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateCampaignUrl } from '../utils/UrlUtilities';
import { CustomStyles } from '../styles/custom';

const CampaignUrl = ({ value, onChange, disabled = false }) => {
  const [isUrlValid, setIsUrlValid] = useState(false);

  useEffect(() => {
    const isValid = validateCampaignUrl(value);
    setIsUrlValid(isValid);
  }, [value, setIsUrlValid]);
  
  return (
    <Container style={disabled ? { backgroundColor: '#cccccc' } : {}}>
      <ValidationIcon
        icon={isUrlValid ? faCircleCheck : faCircleXmark}
        style={{ color: isUrlValid ? CustomStyles.colors.green : CustomStyles.colors.red }} />
      <UrlInput disabled={disabled} type="text" placeholder="https://tiltify.com/@username/campaign-slug" value={value} onChange={(e) => onChange(e.target.value)} />
    </Container>
  );
}

export default CampaignUrl;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  align-items: center;

  width: 500px;
  padding: 10px 15px;

  border: 1px solid #cccccc;
  border-radius: 6px;
  outline-width: 0;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`;

const ValidationIcon = styled(FontAwesomeIcon)`
  color: ${p => p.isUrlValid ? 'green' : 'red'};
`;

const UrlInput = styled.input`
  border: none;
  outline-width: 0;

  width: 100%;

  &::placeholder {
    color: #cccccc;
  }

  &:disabled {
    background-color: #cccccc;
  }
`;
