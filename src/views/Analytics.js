import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import CampaignCard from '../components/CampaignCard';
import AnalyticsCard from '../components/AnalyticsCard';
import HourlyBalanceChart from '../components/charts/HourlyBalance';
import HourlyTotalChart from '../components/charts/HourlyTotalChart';
import HourlyAverageChart from '../components/charts/HourlyAverageChart';
import HourlyCountChart from '../components/charts/HourlyCountChart';
import DonationsScatterChart from '../components/charts/DonationsScatterChart';

const Analytics = () => {
  const { userId, campaignSlug } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [donations, setDonations] = useState(null);
  const navigate = useNavigate();

  // useEffect to get the campaign
  // if it is not cached redirect to home page
  // else get analytics

  useEffect(() => {
    const get = async () => {
      const client = axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}`
      });

      try {
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
      }
    }

    get();
  }, [userId, campaignSlug, navigate, setCampaign, setAnalytics, setDonations]);

  const isReady = () => {
    return campaign && analytics && donations;
  }

  return (
    <Container>
      <h2>{ userId }/{ campaignSlug }</h2>
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
