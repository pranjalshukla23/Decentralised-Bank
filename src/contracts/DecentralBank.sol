pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {

    address public owner;
    string public name = 'Decentral Bank';
    Tether public tether;
    RWD public rwd;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    address [] public stakers;


    constructor(RWD _rwd, Tether _tether) public{

        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function depositTokens(uint _amount) public {

        //require staking amount to be greater than zero
        require(_amount > 0,"amount cannot be zero");

        //transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender,address(this),_amount);


        //update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        //if user is a new staker
        if(!hasStaked[msg.sender]){

            stakers.push(msg.sender);
        }

        //update staking
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //issue reward tokens
    function issueTokens() public {

        //require the owner to issue tokens only
        require(msg.sender == owner,"the caller must be the owner");

        for(uint i=0; i<stakers.length;i++){

            address recipient = stakers[i];

            // divide by 9 to create percentage incentives for stakers
            uint balance = stakingBalance[recipient] / 9;

            if(balance > 0){

                //send reward tokens
                rwd.transfer(recipient, balance);
            }

        }
    }

    //unstake tokens
    function unstakeTokens() public{

        uint balance = stakingBalance[msg.sender];

        //require the amount to be greater than zero
        require(balance > 0, 'staking balance cannot be less than zero');

        //transfer the tokens to the specified account address from our bank
        tether.transfer(msg.sender,balance);

        //reset staking balance
        stakingBalance[msg.sender] = 0;

        //update staking status
        isStaking[msg.sender] = false;
        hasStaked[msg.sender] = false;

    }
}
