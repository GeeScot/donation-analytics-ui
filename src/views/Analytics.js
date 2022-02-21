import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Analytics = () => {
  const { userId, campaignSlug } = useParams();

  // useEffect to get the campaign
  // if it is not cached redirect to home page
  // else get analytics

  return (
    <Container>
      <h2>{ userId }/{ campaignSlug }</h2>
    </Container>
  );
}

export default Analytics;

const Container = styled.div`
  margin: 20px 0;
`;
