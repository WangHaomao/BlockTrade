var StrategyInvestment = artifacts.require('./StrategyInvestment.sol');

contract("StrategyInvestment", function(accounts) {
	var SIInstance;
	it("initializes with 3 strategies", function() {
	    return StrategyInvestment.deployed().then(function(instance) {
	      return instance.strategiesCount();
	    }).then(function(count) {
	      assert.equal(count, 3);
	    });
	  });

	// it("init money test", function() {
	//     return StrategyInvestment.deployed().then(function(instance) {
	//       SIInstance = instance;
	//       return SIInstance.users(accounts[3]);
	//     }).then(function(user) {
	//       assert.equal(user.holdCurrency, 100);
	//       return SIInstance.users(accounts[7]);
	//     }).then(function(user) {
	//     	assert.equal(user.holdCurrency, 100);
	//     });
	//   });

	it("Investment function test", function() {
	    return StrategyInvestment.deployed().then(function(instance) {
	      SIInstance = instance;
	      money = 10;
	      strategyID = 2;


	      // 7 投资 3用户 10 块钱

	      // 10 * 3 = 30
	      // 30 * 7 / 100 = 2
	      // 7 + 28, 3 + 2

	      SIInstance.investigate(money,strategyID,{from: accounts[7]});
	      return SIInstance.users(accounts[3]);
	    }).then(function(user) {
	      var money = user.holdCurrency;
	      // console.log(money);
	      assert.equal(money, 105);
	      // Try to vote again
	      // return electionInstance.vote(candidateId, { from: accounts[1] });
	    });
	  });


});