App = {
  // web3Provider: null,
  // contracts: {},
  // account: '0x0',
  // hasVoted: false,
  web3Provider: null,
  contracts: {},

  init: function() {

    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("StrategyInvestment.json", function(siData) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.StrategyInvestment = TruffleContract(siData);
      // Connect provider to interact with contract
      App.contracts.StrategyInvestment.setProvider(App.web3Provider);

      // App.listenForEvents();

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err == null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.StrategyInvestment.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.randomCount();
    }).then(function(randomCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 0; i < randomCount; i++) {
        var x = i;

        electionInstance.randomNums(i).then(function(ran) {
          var id = ran;
          var candidateTemplate = "<tr><th>" + id +"</td></tr>" 
          candidatesResults.append(candidateTemplate);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  investigate: function() {
    App.contracts.StrategyInvestment.deployed().then(function(instance) {
      return instance.testRandom({from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
      console.log(result);
    }).catch(function(err) {
      console.error(err);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});