var requestRes = GetRequest();
App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const StrategyInvestment = await $.getJSON('StrategyInvestment.json')
    App.contracts.StrategyInvestment = TruffleContract(StrategyInvestment)
    App.contracts.StrategyInvestment.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.StrategyInvestment = await App.contracts.StrategyInvestment.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    const user = await App.StrategyInvestment.users(App.account)
    $('#accountAddress').html(web3.toUtf8(user[0]));
    
    // console.log(userMoney[1]);
    $('#accountMoney').html(user[1].toNumber());

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {

    var loader = $("#loader");
    var content = $("#content");

    var candidatesResults = $("#strategy");
    candidatesResults.empty();

    // Load the total task count from the blockchain
    const strategy = await App.StrategyInvestment.strategies(requestRes['sid']);
    const id = strategy[0].toNumber();
    const name = strategy[2];
    const dividendRate = strategy[3];
    var candidateTemplate = "<tr><th>" + id 
                          + "</th><td><a onclick='App.toStrategy("+ id +")'>" + name 
                          + "</td><td>" + dividendRate + "%" 
                          + "</td><td>" + strategy[6].toNumber() / 100
                          + "</td><td>" + strategy[7].toNumber() / 100
                          + "</td><td>" + strategy[8].toNumber() / 100
                          + "</td><td>" + web3.toUtf8(strategy[5])
                          + "</td></tr>"
    candidatesResults.append(candidateTemplate);
  },
  toStrategy: async (sid) => {
    window.location.href = "/strategy.html?sid=" + sid;
  },

  invest: async () => {
    App.setLoading(true)

    const strategyId = requestRes['sid'];
    const principal = $('#principal').val();
    await App.StrategyInvestment.invest(principal,strategyId, { from: App.account });
    window.location.reload();
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
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