var StrategyInvestment = artifacts.require("./StrategyInvestment.sol");

module.exports = function(deployer) {
  deployer.deploy(StrategyInvestment);
};
