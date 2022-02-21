

export function validateCampaignUrl(campaignUrl) {
  const campaignUrlRegex = /(https:\/\/tiltify.com\/)(@[A-Za-z]+)\/([A-Za-z0-9-]+)/g;
  return campaignUrlRegex.test(campaignUrl);
}

export function parseCampaignUrl(campaignUrl) {
  const campaignUrlRegex = /(https:\/\/tiltify.com\/)(@[A-Za-z]+)\/([A-Za-z0-9-]+)/g;
  return campaignUrlRegex.exec(campaignUrl);
}
