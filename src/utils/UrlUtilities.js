function getCampaignUrlRegex() {
  return /(https:\/\/tiltify.com\/)([@+]{1}[A-Za-z0-9-]{4,})\/([A-Za-z0-9-]{4,})/g;
}

export function validateCampaignUrl(campaignUrl) {
  const campaignUrlRegex = getCampaignUrlRegex();
  return campaignUrlRegex.test(campaignUrl);
}

export function parseCampaignUrl(campaignUrl) {
  const campaignUrlRegex = getCampaignUrlRegex();
  return campaignUrlRegex.exec(campaignUrl);
}
