var requestRes = GetRequest();
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
    // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    // web3 = new Web3(App.web3Provider);
    // web3.eth.getAccounts(function(error, accounts) {
    //     console.log(accounts);
    // });

    
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
      return electionInstance.strategiesCount();
    }).then(function(strategiesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      
      
      electionInstance.users(App.account).then(function(user) {
          $("#accountMoney").html("Your Money: " + user[0]);
      });

      electionInstance.strategies(requestRes['sid']).then(function(strategy) {
          var id = strategy[0];
          var name = strategy[2];
          var voteCount = strategy[3];
          // Render candidate Result
          // console.log(strategy[3]);
          var candidateTemplate = "<tr><th id = \"strategyID\">" + id 
                                + "</th><td>" + name 
                                + "</td><td>" + voteCount
                                + "</td><td>" + strategy[4] 
                                + "</td><td>" + strategy[5]
                                + "</td></tr>" 
          candidatesResults.append(candidateTemplate);
      });


      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  investigate: function() {
    var strategyId = $('#strategyID').val();
    var principal = $('#principal').val();
    /*add a check for principal*/

    App.contracts.StrategyInvestment.deployed().then(function(instance) {
      return instance.investigate(principal,strategyId, { from: App.account });
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
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};