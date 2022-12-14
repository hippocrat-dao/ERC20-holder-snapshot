const ethers = require('ethers');
const fs = require('fs');

// balanceSheet of ERC20
const balanceSheet = new Map();

const buildBalanceSheet = async (index = "") => {
    // get transaction receipt 
    const data = JSON.parse(
        await fs.promises.readFile(
            `./log/transferLog${index}.json`,
            'utf-8')
    );
    // iterate over transaction receipt
    for (let i = 0; i < data.length; i++) {
        // from address balance decreases
        if (balanceSheet.has(data[i].args[0])) {
            balanceSheet.set(
                data[i].args[0], 
                balanceSheet.get(data[i].args[0])
                - (ethers.BigNumber.from(data[i].args[2].hex)).toBigInt());
        } else {
            balanceSheet.set(
                data[i].args[0], 
                - (ethers.BigNumber.from(data[i].args[2].hex)).toBigInt());
        }
        // to address balance increases
        if (balanceSheet.has(data[i].args[1])) {
            balanceSheet.set(
                data[i].args[1], 
                balanceSheet.get(data[i].args[1])
                + (ethers.BigNumber.from(data[i].args[2].hex)).toBigInt());
        } else {
            balanceSheet.set(
                data[i].args[1], 
                (ethers.BigNumber.from(data[i].args[2].hex)).toBigInt())
        }
    }
    console.log("transferLog" + index + " is done");
}
// write final balance sheet to json file
const writeBalanceSheet = async (balanceSheet) => {
    // Big Int to string
    await balanceSheet.forEach((value, key, map) => {
        // get rid of empty adresses & null address
        value <= BigInt("0")  ? map.delete(key)
        : map.set(key, value.toString())
    })
    console.log(balanceSheet.size);
    // write balanceSheet to json
    await fs.promises.writeFile(
        'balanceSheet.json',
        JSON.stringify(
            Object.fromEntries(balanceSheet)
    ))    
}

const createBalanceSheet = async () => {    
    // in case of multiple tranfer log files
    const buildBalanceSheetLoop = async (index) => {
        for (let i = 1; i < index + 1; i++) {
            i < 10 ? await buildBalanceSheet("0"+i) : 
            await buildBalanceSheet(i.toString())
    }}

    process.argv[2] === undefined ? 
    await buildBalanceSheet()
    : await buildBalanceSheetLoop(parseInt(process.argv[2]))
    
    await writeBalanceSheet(balanceSheet);
}

createBalanceSheet();