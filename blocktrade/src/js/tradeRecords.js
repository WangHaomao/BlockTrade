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
        // $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.StrategyInvestment.deployed().then(function(instance) {
      InvestmentInstance = instance;
      return InvestmentInstance.users(App.account);

    }).then(function(user) {
      console.log(user);
      $('#accountAddress').html(web3.toUtf8(user[0]) + " / " + user[1]);
      $('#accountMoney').html(user[1].toNumber());
      App.Username = web3.toUtf8(user[0]);
      console.log(user[6]);
      return InvestmentInstance.transcationsCount();

    }).then(function(transcationsCount) {
      var HTMLrecords = $("#records");
      HTMLrecords.empty();
      console.log(transcationsCount);
      for (var i = 0; i < transcationsCount; i++) {
        InvestmentInstance.transcations(i).then(function(transcation){
          if(transcation[0] == App.account){
            console.log(App.Username);
            console.log(transcation[3].toNumber());
            console.log(transcation[4].toNumber());

            var ccdate = new Date(1000*transcation[2].toNumber());
            ccdate = format(ccdate, 'yyyy-MM-dd hh:mm:ss')

            var record =  "<tr><th>" + transcation[5] 
                        + "</th><td>" + App.Username 
                        + "</td><td>" + web3.toUtf8(transcation[1])
                        + "</td><td>" + transcation[3].toNumber()
                        + "</td><td>" + transcation[4].toNumber()
                        + "</td><td>" + ccdate
                        + "</td></tr>"

            HTMLrecords.append(record);



            console.log(web3.toUtf8(transcation[1]));
            // InvestmentInstance.users(transcation[1]).then(function(user2){
            //   var name2 = web3.toUtf8(user2[0]);
            //   console.log(name2);
            // });

            // console.log(name2);

          }
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

format = function date2str(x, y) {
  var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
  };
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
  });

  return y.replace(/(y+)/g, function(v) {
      return x.getFullYear().toString().slice(-v.length)
  });
};
