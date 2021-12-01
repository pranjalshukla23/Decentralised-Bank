pragma solidity ^0.5.0;

contract Migrations {

    address public owner;
    uint public last_completed_migration;

    constructor() public{

        owner = msg.sender;

    }

    modifier restricted(){

        if(msg.sender == owner) _;
    }

    //to change last_completed_migration
    function setCompleted(uint completed) public restricted{

        last_completed_migration = completed;
    }

    function upgrade(address new_address) public restricted{

        //getting an instance of existing Migrations contract
        Migrations upgraded = Migrations(new_address);

        //invoking the set_completed function
        upgraded.setCompleted(last_completed_migration);

    }


}
