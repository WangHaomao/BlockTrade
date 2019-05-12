# Blockchain-based trading strategy selection
A repository in project  **blockchain-based trading strategy selection** in MSDB 6000D, Introduce to Blockchain.

Also a tutorial of Dapps development.

## Preparing before start

### Applications and packages
#### 1. nodejs & npm

```shell
brew install node
```

```shell
npm -v
node -v
```

#### 2. truffle

```shell
npm install -g truffle
```

#### 3.  Truffle Ganache 

This is from **data store layer** for blockchain

Download from : [https://truffleframework.com/ganache](https://truffleframework.com/ganache)

### Preparing your folder
```shell
mkdir backtest
cd backtest
truffle unbox pet-shop
```




## Folder Structures
- BlockTrade
    - blocktrade
        - build
            - contracts
                - ...
                - StrategyInvestment.json   // compiled contracts file
        - contracts
            - Migrations.sol
            - StrategyInvestment.sol    // smart contract
        - migrations
            - 1_initial_migration.js
            - 2_deploy_contracts.js     // deploy config
        - node_modules
        - src
            - css
            - js
            - img
            - ...
            - *.html
        - test
            - StrategyInvestment.js
        - bs-config.json
        - package-lock.json
        - package.json
        - truffle-config.js
## Dapp Structures
### Web pages
- css
- js
- img
- ...
- index.html
- strategiesList.html
    - strategyDetail.html
- tradeRecords.html
### Smart contract
#### Main classes
- User
    - name 
 - hold currency
    - address
    - strategies_ids (mapping)
 - transcations_ids (mapping)
    - ...
- Strategy
    - ID
 - ID in user
 - name
 - dividend(reward) rate // the strategy owner will get dividendRate * income if income > 0.
 - owner(developer) address
 - indicates // Simplified version
 - transcations_ids(mapping)
 - ...
- Transcation
 - address from
 - address traget
 - date
 - principle
 - invest result
 - dividend fee
    - strategy id
    - ...
- mapping (address => User) public users;
- mapping (uint => Strategy) public strategies;
- mapping (uint => Transcation) public transcations;

#### Main function
- function _addUser() private returns(bool)
- function addStrategy() private returns(bool) public
- function _addStrategy() private
- function _addTranscation()private returns(bool) private
- function _operateUserCurrency() private
- function invest() returns(bool) public

### Notes:

Remember to close Meta Mask **Privacy Mode**, otherwish we can not get address of account.



```shell
truffle(development)> let instance = await StrategyInvestment.deployed()

truffle(development)> let accounts = await web3.eth.getAccounts()

npm run dev

web3.eth.coinbase
web3.eth.getCoinbase(function(err, cb) { console.log(err, cb); })
```

