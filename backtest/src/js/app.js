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
        console.log(App.account);
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.StrategyInvestment.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.strategiesCount();
    }).then(function(strategiesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 0; i < strategiesCount; i++) {
        var x = i;
        console.log(electionInstance.strategies(i));

        electionInstance.strategies(i).then(function(strategy) {
          var id = strategy[0];
          var name = strategy[2];
          var voteCount = strategy[3];
          // Render candidate Result
          // console.log(strategy[3]);
          var candidateTemplate = "<tr><th>" + id + "</th><td><a onclick='toStrategy("+ id +")'>" + name + "</a></td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

function toStrategy(sid){
  window.location.href = "/strategy.html?sid=" + sid;
};