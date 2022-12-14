# ERC20-holder-snapshot
ERC20 snapshot to get holder-balance list

## How to use

### 1. Replace ERC20_ADDRESS and ERC20_ABI at constants.js

With your own ERC20 address and abi.

### 2. Create .env file in local and declare ETHERSCAN_API_KEY

Just use free one! can get 1000 events per one query.

Or if you use any other provider use that key and modify code for initialization of provider at getTransferEventLog.js.

### 3. Run getTransferEventLog.js with fromBlockHeight, toBlockHeight

``` bash
$ node getTransferEventLog.js 8345679 16132364
```

This will write transferLog.json in log directory.

In case you cannot query all Transfer events at once, write multiple logs with third argument

``` bash
$ node getTransferEventLog.js 8345679 8393104 1
...
...
...
$ node getTransferEventLog.js 15154018 16132364 32
```

This will write transferLog01.json ... transferLog32.json in log directory.

Because most RPC providers limit the number of transfer events to query for once, it could be useful.

### 4. Run createBalanceSheet.js

``` bash
$ node createBalanceSheet.js
```

In case you cannot query all Transfer events at once, iterate over multiple logs you made with an iteration argument

``` bash
$ node createBalanceSheet.js 32
```

This will write balanceSheet.json, which is a hashtable of keys(addresses) and values(balances)