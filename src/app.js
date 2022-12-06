const ethers = require('ethers');
const { HUM_ADDRESS, HUM_ABI } = require('./constants');
require('dotenv').config();

const provider = new ethers.providers.EtherscanProvider('homestead', process.env.ETHERSCAN_API_KEY);

const HUM = new ethers.Contract(HUM_ADDRESS, HUM_ABI, provider);

const filter = new HUM.filters.Transfer();

const eventLogs = async () => console.log(
    await HUM.queryFilter(filter, -1000, "latest"));

eventLogs();