pragma solidity ^0.5.0;

contract StrategyInvestment{
	struct Strategy{
		uint ID;
		uint IDinUser;
		// the strategy owner will get dividendRate * income if income > 0.
		string Name;
		int dividendRate;
		address ownerAddress;
		int indicates; // simplfy it
		bool isValid;
	}
	struct User{
		// 拥有的虚拟货币
		int holdCurrency;
		uint strategiesCount;
		uint validSCount;
		// 不知道需不需要Hash
		address userAddress;
		bool isValid;

		mapping(uint => Strategy) strategies;
	}
	mapping (address => User) public users;
	mapping (uint => Strategy) public strategies;
	uint public strategiesCount;
	/*构造函数*/
	constructor() public{
		_init();
		if(!users[msg.sender].isValid){
			_addUser(msg.sender);
		}
	}

	function _init() private{
		/*add two users*/
		address addr_index07 = 0x8473dB8d4106e66158673dE19C290E4516250dDc;
		address addr_index03 = 0x73Ea460Ae904C3f0496f02Eea271eCeBd2fB0490;
		_addUser(addr_index03);
		_addUser(addr_index07);

		string memory name1 = "strategy1";
		string memory name2 = "WANG YUxian s incoming strategy";
		string memory name3 = "Li Haoyang的超级无敌宇宙策略";

		_addStrategy(addr_index07,name1,5,3);
		_addStrategy(addr_index07,name2,5,122);
		_addStrategy(addr_index03,name3,10,10);
	}

	function _addUser(address _addr) private returns(bool){
		// is exist
		if(users[_addr].isValid) return false;

		User memory newUser;
		// newUser.holdCurrency;
		newUser.userAddress = _addr;
		users[_addr] = newUser;
		users[_addr].holdCurrency = 100; // 100.00 actually
		users[_addr].strategiesCount = 0;
		users[_addr].validSCount = 0;
		users[_addr].isValid = true;

		return true;
	}
	function _operateUserCurrency(address userAddress, int opeN) private{
		// if(opeN < 0 && users[userAddress].holdCurrency + opeN < 0){
		// 	return false;
		// }
		users[userAddress].holdCurrency = users[userAddress].holdCurrency + opeN;
		// return true;
	}

	function addStrategy(string memory _sName,int _dRate,int indicates) public{
		address addr = msg.sender;
		_addStrategy(addr,_sName,_dRate,indicates);
	}
	function _addStrategy(address addr,string memory _sName,int _dRate,int indicates) private{
		// usersCount++;
		uint id = users[addr].strategiesCount;
		users[addr].strategies[id] = Strategy(strategiesCount,id,_sName,_dRate,addr,indicates,true);
		
		strategies[strategiesCount] = users[addr].strategies[id];

		users[addr].strategiesCount++;
		strategiesCount++;
	}
	function investigate(int principal, uint sCount) public {
		/*
			principal: investment principal
			sCount: strategiesCount
		*/
		
		address strategyOwner = strategies[sCount].ownerAddress;
		address investor = msg.sender;

		int totalIncome = principal * strategies[sCount].indicates;
		if(totalIncome > principal){
			if(strategyOwner != investor){
				int dividendFee = (totalIncome - principal) * strategies[sCount].dividendRate;


				dividendFee = dividendFee / 100;
				totalIncome = totalIncome - dividendFee;
				_operateUserCurrency(strategyOwner,dividendFee);
			}
		}
		_operateUserCurrency(investor,totalIncome);

	}
}