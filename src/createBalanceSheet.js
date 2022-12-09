const ethers = require('ethers');
const fs = require('fs');

// balanceSheet of ERC20
const balanceSheet = new Map();

const createBalanceSheet = async (index) => {
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
        // if holds less than 10 ERC20, excludes
        value < BigInt("10000000000000000000")  ? map.delete(key)
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

async function main() {
    for (let i = 1; i < 33; i++) {
        i < 10 ? await createBalanceSheet("0"+i) : 
        await createBalanceSheet(i.toString())
    }
    await writeBalanceSheet(balanceSheet);
}

main();