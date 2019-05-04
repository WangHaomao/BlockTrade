pragma solidity ^0.5.0;


contract StrategyInvestment{

	struct Transcation{
		address fromAddr;
		address toAddr;
		uint256 tDate;
		int investResult;
	}
	// struct Indicates{
	// 	int daily_return;
	// 	int sharpe_ratio;
	// 	int maximum;
	// 	int draw_down;
	// }

	struct Strategy{
		uint ID;
		uint IDinUser;
		// the strategy owner will get dividendRate * income if income > 0.
		string Name;
		int dividendRate;
		address ownerAddress;
		bytes32 ownerName;
		// int indicates; // simplfy it
		
		//indicates;index 6 ,7 ,8
		int daily_return;
		int sharpe_ratio;
		int maximum_draw_down;


		bool isValid;
		uint trCount;
		mapping(uint => Transcation) transcations;
	}
	struct User{
		// 拥有的虚拟货币
		bytes32 username;
		int holdCurrency;
		uint strategiesCount;
		uint validSCount;
		// 不知道需不需要Hash
		address userAddress;
		bool isValid;

		mapping(uint => uint) strategies_ids;
	}
	int nonce = 1;
	// mapping (uint => int) public randomNums;
	// uint public randomCount;


	mapping (bytes32 => address) public usersname_to_address; 
	mapping (address => User) public users;
	mapping (uint => Strategy) public strategies;
	uint public strategiesCount;

	/*构造函数*/
	constructor() public{
		_init();
		// require(users[msg.sender].isValid);
		// if(!users[msg.sender].isValid){
		// 	_addUser(msg.sender);
		// }
	}

	function bytes32ToString(bytes32 x) public returns (string memory) {
	    bytes memory bytesString = new bytes(32);
	    uint charCount = 0;
	    for (uint j = 0; j < 32; j++) {
	        byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
	        if (char != 0) {
	            bytesString[charCount] = char;
	            charCount++;
	        }
	    }
	    bytes memory bytesStringTrimmed = new bytes(charCount);
	    for (uint j = 0; j < charCount; j++) {
	        bytesStringTrimmed[j] = bytesString[j];
	    }
	    return string(bytesStringTrimmed);
	}

	// function convertingToString(bytes32 hw)public returns(string memory){
	// 	// bytes32 memory hw = "Hello World";
	// 	string memory converted = string(hw);
	// 	return converted;
	// }

	function _init() private{
		/*add two users*/
		address addr_index07 = 0x8473dB8d4106e66158673dE19C290E4516250dDc;
		address addr_index03 = 0x73Ea460Ae904C3f0496f02Eea271eCeBd2fB0490;
		
		bytes32 user_name1 = "铁民";
		bytes32 user_name2 = "黄雨伞";


		_addUser(addr_index03,user_name1);
		_addUser(addr_index07,user_name2);

		string memory name1 = "strategy1";
		string memory name2 = "WANG YUxian s incoming strategy";
		string memory name3 = "Li Haoyang的超级无敌宇宙策略";

		
		_addStrategy(addr_index07,name1,5,1,2,3);
		_addStrategy(addr_index07,name2,5,1,2,3);
		_addStrategy(addr_index03,name3,10,1,2,3);
	}

	function _addUser(address _addr, bytes32 _uname) private returns(bool){
		// is exist
		if(users[_addr].isValid) return false;
		users[_addr].username = _uname;
		users[_addr].userAddress = _addr;
		users[_addr].holdCurrency = 100; // 100.00 actually
		users[_addr].strategiesCount = 0;
		users[_addr].validSCount = 0;
		users[_addr].isValid = true;

		usersname_to_address[_uname] = _addr;

		return true;
	}
	function _operateUserCurrency(address userAddress, int opeN) private{
		// if(opeN < 0 && users[userAddress].holdCurrency + opeN < 0){
		// 	return false;
		// }
		users[userAddress].holdCurrency = users[userAddress].holdCurrency + opeN;
		// return true;
	}

	function addStrategy(string memory _sName,int _dRate,int in1,int in2,int in3) public{
		address addr = msg.sender;
		_addStrategy(addr,_sName,_dRate, in1, in2, in3);
	}
	function _addStrategy(address addr,string memory _sName,int _dRate,int in1,int in2,int in3) private{
		// usersCount++;
		uint id = users[addr].strategiesCount;

		strategies[strategiesCount].ID = strategiesCount;
		strategies[strategiesCount].IDinUser = id;
		// the strategy owner will get dividendRate * income if income > 0.
		strategies[strategiesCount].Name = _sName;
		strategies[strategiesCount].dividendRate = _dRate;
		strategies[strategiesCount].ownerAddress = addr;


		strategies[strategiesCount].daily_return = in1; // simplfy it
		strategies[strategiesCount].sharpe_ratio = in2; // simplfy it
		strategies[strategiesCount].maximum_draw_down = in3; // simplfy it



		strategies[strategiesCount].isValid = true;
		strategies[strategiesCount].trCount = 0;

		strategies[strategiesCount].ownerName = users[addr].username;


		users[addr].strategies_ids[id] = strategiesCount;
		users[addr].strategiesCount++;
		strategiesCount++;
	}
	function _addTranscation(address fromAddr, address toAddr, int res, uint sId) private{
		
		uint trId = strategies[sId].trCount;

		strategies[sId].transcations[trId].fromAddr = fromAddr;
		strategies[sId].transcations[trId].toAddr = toAddr;
		strategies[sId].transcations[trId].tDate = now;
		strategies[sId].transcations[trId].investResult = res;

	}
	// function update() public{
	// 	/**/
	// }
	function getRandomNum() public returns (int){
		// uint o1 = 2;
		int randomnumber = int(keccak256(abi.encodePacked(now, msg.sender, nonce))) % 100;
	    // randomNums[randomCount] = randomnumber;
	    // randomCount++;
	    nonce = (nonce + 1) % 7777777;
	    return randomnumber;
	}
	function invest(int principal, uint sCount) public {
		/*
			principal: investment principal
			sCount: strategiesCount
		*/
		address strategyOwner = strategies[sCount].ownerAddress;
		address investor = msg.sender;

		int investmentRes = getRandomNum();


		int totalIncome = principal;

		if(investmentRes > 0){
			investmentRes = (investmentRes *  principal) / 100;
			if(strategyOwner != investor){
				int dividendFee = investmentRes * strategies[sCount].dividendRate;
				dividendFee = dividendFee / 100;
				totalIncome = totalIncome + investmentRes - dividendFee;
				_operateUserCurrency(strategyOwner,dividendFee);
			}
		}else{
			investmentRes = (-1 * investmentRes *  principal) / 100;
			if(investmentRes >  principal){
				totalIncome = 0;
			}else{
				totalIncome = totalIncome - investmentRes;
			}
		}
		_operateUserCurrency(investor,totalIncome);
	}
}