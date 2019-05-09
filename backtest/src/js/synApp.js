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
      console.log('....');
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
    console.log(App.account)
    console.log(App.StrategyInvestment.users(App.account))
    const user = await App.StrategyInvestment.users(App.account)
    console.log(user[0])
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

    var candidatesResults = $("#strategiesList");
    candidatesResults.empty();

    // Load the total task count from the blockchain
    const strategiesCount = await App.StrategyInvestment.strategiesCount();
    // const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 0; i < strategiesCount; i++) {
      // Fetch the task data from the blockchain
      const strategy = await App.StrategyInvestment.strategies(i);
      const id = strategy[0].toNumber();
      const name = strategy[2];
      const dividendRate = strategy[3];

      // Create the html for the task
      // const $newTaskTemplate = $taskTemplate.clone()
      // $newTaskTemplate.find('.content').html(taskContent)
      // $newTaskTemplate.find('input')
      //                 .prop('name', taskId)
      //                 .prop('checked', taskCompleted)
      //                 .on('click', App.toggleCompleted)

      // Put the task in the correct list
      // if (taskCompleted) {
      //   $('#completedTaskList').append($newTaskTemplate)
      // } else {
      //   $('#taskList').append($newTaskTemplate)
      // }

      // Show the task
      // $newTaskTemplate.show()
      var candidateTemplate = "<tr><th>" + id 
                            + "</th><td><a onclick='App.toStrategy("+ id +")'>" + name 
                            + "</td><td>" + dividendRate + "%" 
                            + "</td><td>" + strategy[6].toNumber() / 100
                            + "</td><td>" + strategy[7].toNumber() / 100
                            + "</td><td>" + strategy[8].toNumber() / 100
                            + "</td><td>" + web3.toUtf8(strategy[5])
                            + "</td></tr>"
      candidatesResults.append(candidateTemplate);


    }
    // App.setLoading(false);
  },
  toStrategy: async (sid) => {
    window.location.href = "/strategy.html?sid=" + sid;
  },

  createTask: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    await App.todoList.createTask(content)
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId)
    window.location.reload()
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