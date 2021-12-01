//getting the artifacts of Migrations contract
const Migrations = artifacts.require('Migrations');

//defining and exporting the deployer function
module.exports = async function(deployer){

    deployer.deploy(Migrations);
};