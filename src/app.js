const ethers = require('ethers');
const { ERC20_ADDRESS, ERC20_ABI } = require('./constants');
require('dotenv').config();

const provider = new ethers.providers.EtherscanProvider('homestead', process.env.ETHERSCAN_API_KEY);

const ERC20 = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider);

const filter = new ERC20.filters.Transfer();

const eventLogs = async () => console.log(
    await ERC20.queryFilter(filter, -1000, "latest"));

eventLogs();