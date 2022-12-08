const ethers = require('ethers');
const fs = require('fs');
const { ERC20_ADDRESS, ERC20_ABI } = require('./constants');
require('dotenv').config();

const provider = new ethers.providers.EtherscanProvider('homestead', process.env.ETHERSCAN_API_KEY);

const ERC20 = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider);
/*********************************************************************
    IMPORTANT: include Mint, Burn or whatever besides Transfer 
               to get full logs of ERC20 balance updates(if required).
               Transfer itself may be not enough.
***********************************************************************/
const filter = new ERC20.filters.Transfer();

const eventLogs = async () =>
    await fs.promises.writeFile(
        'transferLog.json',
        JSON.stringify(
            /*
                Keep in mind that many backends will discard old events, 
                and that requests which are too broad may get dropped 
                as they require too many resources to execute the query.
                Try segmenting block ranges and requesting sequentially!
            */
            await ERC20.queryFilter(filter,
                8345679, // from block height(ERC20 created block)
                "latest" // to block height(snapshot block)
    )));

eventLogs();