import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x71575cBa17583eA55D20d0Fb9cF55540Be9774e5'
);

export default instance;