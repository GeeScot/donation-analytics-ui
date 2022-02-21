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

const Home = () => {
  const height = useWindowHeight();
  const [campaignUrl, setCampaignUrl] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const navigate = useNavigate();
  const client = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`
  });

  const configureCampaign = async () => {
    try {
      const sleep = ms => new Promise(r => setTimeout(r, ms));

      setLoading(true);
      setLoadingStatus('Fetching Campaign');

      const campaignUrlData = parseCampaignUrl(campaignUrl);
      const userId = campaignUrlData[2];
      const campaignSlug = campaignUrlData[3];

      const { data: campaignDetails } = await client.get(`/tiltify/${userId}/${campaignSlug}`);
      if (campaignDetails.isCached) {
        navigate(`/${userId}/${campaignSlug}`);
        return;
      }

      setCampaign(campaignDetails.campaign);

      setLoadingStatus('Getting Donations from Tiltify');
      await client.get(`/tiltify/${userId}/${campaignSlug}/cache`);
      await sleep(1000);

      setLoadingStatus('Calculating');
      await client.get(`/tiltify/${userId}/${campaignSlug}/calculate`);
      await sleep(1000);

      navigate(`/${userId}/${campaignSlug}`);
    } catch(e) {
      console.log(e);
    } finally {
      setLoading(false);
      setLoadingStatus(null);
    }
  }

  return (
    <Container style={{ height }}>
      <Label>Tiltify Donation Analytics</Label>
      <CampaignUrl value={campaignUrl} onChange={setCampaignUrl} disabled={campaign !== null} />
      {loading &&
        <LoadingContainer>
          <CircleLoader loading={true} size={25} color={CustomStyles.colors.darkGrey} />
          {loadingStatus && <LoadingLabel>{ loadingStatus }...</LoadingLabel>}
        </LoadingContainer>
      }
      {campaign && <CampaignCard campaign={campaign} />}
      {(!loading && !campaign) && <ConfirmButton onClick={configureCampaign}>Confirm</ConfirmButton>}
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

const Label = styled.div``;

const CustomButton = styled.button`
  width: 150px;
  padding: 6px 0;

  border: none;
  border-radius: 6px;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  cursor: pointer;
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

const ConfirmButton = styled(CustomButton)`
  color: #444444;
  background-color: #3ace3a;
`;
