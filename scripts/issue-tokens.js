//decentral bank artifacts
const DecentralBank = artifacts.require('DecentralBank');


module.exports = async function issueRewards(callback){

    //get instance of deployed contract
    let decentralBank = await DecentralBank.deployed();

    //call issueTokens function in contract
    await decentralBank.issueTokens();

    console.log('Tokens have been issued successfully');

    callback();
}