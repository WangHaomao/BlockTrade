# Blockchain-based trading strategy selection
A repository in project  **blockchain-based trading strategy selection** in MSDB 6000D, Introduce to Blockchain.

Also a tutorial of Dapps development.

## Preparing before start

### Applications and packages
#### 1. npm

```shell
npm --version
```

#### 2. truffle

```shell
npm install -g truffle
```

#### 3.  Ganache truffle

This is from **data store layer** for blockchain

Download from : [https://truffleframework.com/ganache](https://truffleframework.com/ganache)

### Preparing your folder
```shell
mkdir backtest
cd backtest
truffle unbox pet-shop
```





Writing …. 









### Notes:

Remember to close Meta Mask **Privacy Mode**, otherwish we can not get address of account.



```shell
truffle(development)> let instance = await StrategyInvestment.deployed()

truffle(development)> let accounts = await web3.eth.getAccounts()

npm run dev

web3.eth.coinbase
web3.eth.getCoinbase(function(err, cb) { console.log(err, cb); })
```

