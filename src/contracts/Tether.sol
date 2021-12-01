pragma solidity ^0.5.0;

contract Tether{

    string public name = 'Tether';

    string public symbol = 'USDT';

    uint public totalSupply = 1000000000000000000000000; //1 million tokens

    uint public decimals = 18;

    event Transfer(address indexed _from, address indexed _to, uint indexed _value);

    event Approval(address indexed _owner, address indexed _to, uint indexed _value);

    mapping (address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public{

        balanceOf[msg.sender] = totalSupply;

    }

    function transfer(address _to, uint _value) public returns(bool success){

        //require thar the value is greater or equal to transfer
        require(balanceOf[msg.sender] >= _value);

        //transfer the amount and subtract the balance
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;

        //add the balance
        balanceOf[_to] = balanceOf[_to] + _value;

        emit Transfer(msg.sender,_to,_value);

        return true;
    }


    function approve(address _spender, uint256 _value) public returns(bool success){

        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender,_spender,_value);

        return true;

}

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){

        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        //add the balance
        balanceOf[_to] = balanceOf[_to] + _value;

        //subtract the balance
        balanceOf[_from] = balanceOf[_from] - _value;

        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

        emit Transfer(_from,_to,_value);

        return true;
    }

}