const ethers = require('ethers');
const fs = require('fs');
const { ERC20_ADDRESS, ERC20_ABI } = require('./constants');
require('dotenv').config();

const provider = new ethers.providers.EtherscanProvider('homestead', process.env.ETHERSCAN_API_KEY);

const ERC20 = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, provider);
/*********************************************************************
    IMPORTANT: Usually Transfer event will be enought to get full logs 
               of ERC20 balance updates, Because Mint, Burn or 
               whatever methods to transfer ERC20 also emits Transfer event.
               However, There might be an exception. Be cautious!
***********************************************************************/
const filter = new ERC20.filters.Transfer();

const getTransferEventLog = async (index = "") => {
    index < 10 && index != "" ? index = "0" + index : index = index
    await fs.promises.writeFile(
        `./log/transferLog${index}.json`,
        JSON.stringify(
            /*
                Keep in mind that many backends will discard old events, 
                and that requests which are too broad may get dropped 
                as they require too many resources to execute the query.
                Try segmenting block ranges and requesting sequentially!
            */
            await ERC20.queryFilter(filter,
                parseInt(process.argv[2]), // from block height(ERC20 created block, ex) 8345679)
                parseInt(process.argv[3]) // to block height(snapshot block)
    )))};

getTransferEventLog(process.argv[4]);