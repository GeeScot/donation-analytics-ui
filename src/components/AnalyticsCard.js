import styled from 'styled-components';

const AnalyticsCard = ({ analytics, donations, causeCurrency }) => {
  const topDonation = donations.map(x => x.amount).sort((a, b) => b - a)[0];
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: causeCurrency ?? 'USD' });

  return (
    <Column>
      <GroupGrid>
        <GroupRow>
          <GroupLabel>Donation Stats</GroupLabel>
          <GroupValue>&nbsp;</GroupValue>
        </GroupRow>
        <GroupRow>
          <GroupLabel>Total Raised</GroupLabel>
          <GroupValue>{formatter.format(analytics?.analytics.total)}</GroupValue>
        </GroupRow>
        <GroupRow>
          <GroupLabel>Average</GroupLabel>
          <GroupValue>{formatter.format(analytics?.analytics.average)}</GroupValue>
        </GroupRow>
        <GroupRow>
          <GroupLabel># of Donations</GroupLabel>
          <GroupValue>{analytics?.analytics.count}</GroupValue>
        </GroupRow>
        <GroupRow>
          <GroupLabel>Top Donation</GroupLabel>
          <GroupValue>{formatter.format(topDonation)}</GroupValue>
        </GroupRow>
        <GroupRow>
          <GroupLabel>&nbsp;</GroupLabel>
          <GroupValue>{}</GroupValue>
        </GroupRow>
      </GroupGrid>
      <Row>
        <GroupGrid>
          <GroupRow>
            <GroupLabel>Groups</GroupLabel>
            <GroupValue>&nbsp;</GroupValue>
          </GroupRow>
          {analytics?.groups.map((group) => {
            return (
              <GroupRow key={group.key}>
                <GroupLabel>{group.key}</GroupLabel>
                <GroupValue>{group.count}</GroupValue>
              </GroupRow>
            );
          })}
        </GroupGrid>
      </Row>
    </Column>
  );
};

export default AnalyticsCard;

const Column = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 20px;
  
  justify-content: center;
  align-items: center;
`;

const Row = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 20px;

  justify-content: center;
  align-items: center;
`;

const GroupGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: 20px;
  
  padding: 20px 40px;
  width: 300px;

  border: 1px solid #cccccc;
  border-radius: 6px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  @media print {
    border: none;
    box-shadow: none;
  }
`;

const GroupRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  gap: 20px;
  padding-bottom: 2px;
  font-size: 14px;
  &:first-child {
    border-bottom: none;
    font-weight: bold;
  }
`;

const GroupLabel = styled.div`
  text-align: left;
`;

const GroupValue = styled.div`
  text-align: right;
`;
