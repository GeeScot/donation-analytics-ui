import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { CircleLoader } from 'react-spinners';

import { CustomStyles } from '../styles/custom';
import CampaignUrl from '../components/CampaignUrl';
import CampaignCard from '../components/CampaignCard';
import useWindowHeight from '../hooks/useWindowHeight';
import { parseCampaignUrl } from '../utils/UrlUtilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const height = useWindowHeight();
  const [campaignUrl, setCampaignUrl] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const client = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`
  });

  // move client to hook/callback?
  const configureCampaign = async () => {
    try {
      const sleep = ms => new Promise(r => setTimeout(r, ms));

      setLoading(true);
      setLoadingStatus('Fetching Campaign');

      const campaignUrlData = parseCampaignUrl(campaignUrl);
      const userId = campaignUrlData[2];
      const campaignSlug = campaignUrlData[3];

      const { data: campaignDetails } = await client.get(`/campaign/${userId}/${campaignSlug}`);
      if (campaignDetails.isCached) {
        navigate(`/${userId}/${campaignSlug}`);
        return;
      }

      setCampaign(campaignDetails.campaign);

      setLoadingStatus('Getting Donations from Tiltify');
      await client.get(`/campaign/${userId}/${campaignSlug}/cache`);
      await sleep(1000);

      setLoadingStatus('Calculating');
      await client.get(`/campaign/${userId}/${campaignSlug}/calculate`);
      await sleep(1000);

      navigate(`/${userId}/${campaignSlug}`);
    } catch(e) {
      setError(e.response?.data ?? e.message);
    } finally {
      setLoading(false);
      setLoadingStatus(null);
    }
  }

  const resetCampaign = () => {
    setCampaign(null);
    setError(null);
  }

  return (
    <Container style={{ height }}>
      <Label>Tiltify Donation Analytics</Label>
      <CampaignUrl value={campaignUrl} onChange={setCampaignUrl} disabled={campaign !== null} />
      {error &&
        <ErrorContainer>
          <FontAwesomeIcon icon={faTriangleExclamation} color="#ff6961" />
          <ErrorLabel>{ error }</ErrorLabel>
        </ErrorContainer>
      }
      {loading &&
        <LoadingContainer>
          <CircleLoader loading={true} size={25} color={CustomStyles.colors.darkGrey} />
          {loadingStatus && <LoadingLabel>{ loadingStatus }...</LoadingLabel>}
        </LoadingContainer>
      }
      {campaign && <CampaignCard campaign={campaign} />}
      <ButtonsContainer>
        <ResetButton disabled={loading || !campaign} onClick={resetCampaign}>Reset</ResetButton>
        <ConfirmButton disabled={loading || campaign} onClick={configureCampaign}>Confirm</ConfirmButton>
      </ButtonsContainer>
    </Container>
  );
}

export default Home;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  font-size: 18px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  justify-content: center;
  align-items: center;
`;

const LoadingLabel = styled.div`
  font-size: 15px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ErrorLabel = styled.div`
  font-size: 15px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const CustomButton = styled.button`
  width: 150px;
  padding: 6px 0;

  border: none;
  border-radius: 6px;

  font-size: 14px;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  cursor: pointer;
`;

const ResetButton = styled(CustomButton)`
  color: #333333;
  background-color: #ff6961;

  &:disabled {
    color: #696969;
    background-color: #cccccc;
    cursor: unset;
  }
`;

const ConfirmButton = styled(CustomButton)`
  color: #333333;
  background-color: #ffd1dc;

  &:disabled {
    color: #696969;
    background-color: #cccccc;
    cursor: unset;
  }
`;
