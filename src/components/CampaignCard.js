import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

const CampaignCard = ({ campaign }) => {
  const numberFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: campaign?.causeCurrency ?? 'USD' });

  return (
    <Container>
      <Header>{ campaign.name }</Header>
      <Detail>  
        <FontAwesomeIcon icon={faCircleUser} />
        { campaign.user.username }
      </Detail>
      <Detail>
        <FontAwesomeIcon icon={faCircleDollarToSlot} />
        { numberFormatter.format(campaign.totalAmountRaised) } out of { numberFormatter.format(campaign.fundraiserGoalAmount) }
      </Detail>
      {campaign.livestream.type === 'twitch' &&
        <Detail>
          <FontAwesomeIcon icon={faTwitch} />
          <a
            href={`https://www.twitch.tv/${campaign.livestream.channel}`}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', color: '#444444' }}>{ `twitch.tv/${campaign.livestream.channel}` }</a>
        </Detail>
      }
    </Container>
  );
}

export default CampaignCard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  align-items: flex-start;

  padding: 20px 25px;

  border: 1px solid #cccccc;
  border-radius: 6px;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`;

const Header = styled.div`
  font-weight: bold;
  font-size: 16px;

  margin-bottom: 5px;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  font-size: 14px;
  color: '#444444';
`;
