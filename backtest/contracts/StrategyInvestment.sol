pragma solidity ^0.5.0;

/*
contract Token{
	// ...
}
contract OurCurrency is Token{
	// ...
}
contract User{
	// ...
}
contract Transcation{
	// ...
}
contract Indicates{
	// ...
}
*/
contract StrategyInvestment{

	struct Transcation{
		address fromAddr; // 0
		bytes32 toAddr;   // 1
		uint256 tDate;	  // 2
		int investResult; // 3
		int dividendFee;  // 4

		string strategyName; // 5
	}

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

		uint transcationsCount;
		mapping(uint => uint) transcations_ids;
	}
	struct User{
		
		bytes32 username;
		int holdCurrency; // 拥有的虚拟货币 ( our token)
		uint strategiesCount;
		uint validSCount;
		// may need to Hash
		address userAddress;
		bool isValid;

		uint transcationsCount;
		mapping(uint => uint) strategies_ids;
		// mapping(uint => uint) transcations_ids;
		uint [] transcations_ids;
	}
	int nonce = 1;
	// mapping (uint => int) public randomNums;
	// uint public randomCount;

	mapping (bytes32 => address) public usersname_to_address; 
	mapping (address => User) public users;
	mapping (uint => Strategy) public strategies;
	mapping (uint => Transcation) public transcations;

	uint public transcationsCount;
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

	function _init() private{
		/*add two users*/
		address addr_index07 = 0x8473dB8d4106e66158673dE19C290E4516250dDc;
		address addr_index03 = 0x73Ea460Ae904C3f0496f02Eea271eCeBd2fB0490;
		address addr_index05 = 0xfc908D6E53DaaeA0765d41A908001093abb0Ddb9;
		address addr_index06 = 0xeBeE3C3A55072e9581c1D34fF34C56b2De1ec5E2;
		
		bytes32 user_name1 = "Alice";
		bytes32 user_name2 = "Bob";
		bytes32 user_name3 = "Harry";
		bytes32 user_name4 = "黄雨伞";


		_addUser(addr_index03,user_name1);
		_addUser(addr_index07,user_name2);
		_addUser(addr_index05,user_name3);
		_addUser(addr_index06,user_name4);

		string memory name1 = "YUxian 1st ssssuper strategy";
		string memory name2 = "UST Genius";
		string memory name3 = "soooo cool";
		string memory name4 = "Tai Po Tsai village super one";
		string memory name5 = "HK good strategy";
		string memory name6 = "科大扛把子";

		
		_addStrategy(addr_index07,name1,15,50,1000,700);
		_addStrategy(addr_index03,name2,4,40,1200,600);
		_addStrategy(addr_index03,name3,10,30,1400,500);
		_addStrategy(addr_index05,name4,7,-52,1900,300);
		_addStrategy(addr_index05,name5,8,45,2000,1000);
		_addStrategy(addr_index06,name6,20,21,5200,300);
	}

	function _addUser(address _addr, bytes32 _uname) private returns(bool){
		// is exist
		if(users[_addr].isValid) return false;
		users[_addr].username = _uname;
		users[_addr].userAddress = _addr;
		users[_addr].holdCurrency = 1000; // 100.00 actually
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

	function _addTranscation(address fromAddr, bytes32 toAddr, uint sId, int dividendFee,int res) private{
		
		transcations[transcationsCount].fromAddr = fromAddr;
		transcations[transcationsCount].toAddr = toAddr;
		transcations[transcationsCount].tDate = now;
		transcations[transcationsCount].investResult = res;
		transcations[transcationsCount].strategyName = strategies[sId].Name;
		transcations[transcationsCount].dividendFee = dividendFee;

		uint scount = strategies[sId].transcationsCount;
		strategies[sId].transcations_ids[scount] = transcationsCount;
		uint ucount = users[fromAddr].transcationsCount;
		// users[fromAddr].transcations_ids[ucount] = transcationsCount;
		users[fromAddr].transcations_ids.push(transcationsCount);

		transcationsCount++;
		strategies[sId].transcationsCount++;

		users[fromAddr].transcationsCount++;
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
		_operateUserCurrency(investor,-1 * principal);

		int investmentRes = getRandomNum();

		// 500
		int totalIncome = principal;
		int dividendFee = 0;

		if(investmentRes > 0){
			investmentRes = (investmentRes *  principal) / 100;
			if(strategyOwner != investor){
				dividendFee = investmentRes * strategies[sCount].dividendRate;
				dividendFee = dividendFee / 100;
				totalIncome = principal + investmentRes - dividendFee;
				_operateUserCurrency(strategyOwner,dividendFee);
			}else{
				totalIncome = principal + investmentRes;
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
		_addTranscation(investor,users[strategyOwner].username,sCount,dividendFee,totalIncome);
	}
}