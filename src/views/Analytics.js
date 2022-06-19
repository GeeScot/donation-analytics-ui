import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { CircleLoader } from 'react-spinners';

import { CustomStyles } from '../styles/custom';
import CampaignCard from '../components/CampaignCard';
import AnalyticsCard from '../components/AnalyticsCard';
import HourlyBalanceChart from '../components/charts/HourlyBalance';
import HourlyTotalChart from '../components/charts/HourlyTotalChart';
import HourlyAverageChart from '../components/charts/HourlyAverageChart';
import HourlyCountChart from '../components/charts/HourlyCountChart';
import DonationsScatterChart from '../components/charts/DonationsScatterChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

const Analytics = () => {
  const { userId, campaignSlug } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [donations, setDonations] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const get = async () => {
      const client = axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}`
      });

      try {
        setLoading(true);

        const { data: campaignDetails } = await client.get(`/campaign/${userId}/${campaignSlug}`);
        if (!campaignDetails.isCached) {
          navigate('/');
          return;
        }

        setCampaign(campaignDetails.campaign);

        const { data: analyticsResponse } = await client.get(`/donations/${userId}/${campaignSlug}/analytics`);
        setAnalytics(analyticsResponse.data);

        const { data: donationsResponse } = await client.get(`/donations/${userId}/${campaignSlug}`);
        setDonations(donationsResponse);
      } catch(e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    get();
  }, [userId, campaignSlug, navigate, setLoading, setCampaign, setAnalytics, setDonations]);

  const isReady = () => {
    return campaign && analytics && donations;
  }

  return (
    <Container>
      <CustomButton onClick={() => navigate('/')}>
        <FontAwesomeIcon icon={faAnglesLeft} />
        <span>Homepage</span>
      </CustomButton>
      <h2>{ userId }/{ campaignSlug }</h2>
      {loading && <CircleLoader loading={true} size={40} color={CustomStyles.colors.darkGrey} />}
      {campaign && <CampaignCard campaign={campaign} />}
      {isReady() &&
        <>
          <AnalyticsCard analytics={analytics} donations={donations} causeCurrency={campaign.causeCurrency} />
          <HourlyBalanceChart data={analytics.hourlyBalance} />
          <HourlyTotalChart data={analytics.hourlyDonations} />
          <HourlyCountChart data={analytics.hourlyDonations} />
          <HourlyAverageChart data={analytics.hourlyDonations} />
          <DonationsScatterChart data={donations} />
        </>
      }
    </Container>
  );
}

export default Analytics;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  justify-content: center;
  align-items: center;

  margin: 20px 0;
`;

const CustomButton = styled.button`
  display: flex;
  flex-direction: row;
  gap: 5px;

  justify-content: center;
  align-items: center;

  width: 150px;
  padding: 6px 0;

  font-size: 14px;

  border: none;
  border-radius: 6px;
  background-color: #ffd1dc;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  cursor: pointer;

  > * {
    vertical-align: middle;
  }
`;
