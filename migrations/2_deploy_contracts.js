//getting the artifacts of Tether, RWD and DecentralBank contract
const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

//defining and exporting the deployer function
module.exports = async function(deployer, network, accounts){

    //deploy Tether contract
    await deployer.deploy(Tether);

    //get deployed Tether contract instance
    const tether = await Tether.deployed();

    //deploy RWD contract
    await deployer.deploy(RWD);

    //get deployed RWD contract instance
    const rwd = await RWD.deployed();


    //deploy DecentralBank contract
    await deployer.deploy(DecentralBank,rwd.address,tether.address);

    //get deployed DecentralBank contract instance
    const decentralBank = await DecentralBank.deployed();

    //Transfer all RWD tokens to Decentral bank
    await rwd.transfer(decentralBank.address,'1000000000000000000000');

   //distribute 100 tether tokens to investor
    await tether.transfer(accounts[1], '100000000000000000000')
};

