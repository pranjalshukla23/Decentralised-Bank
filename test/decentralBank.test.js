//getting artifacts of contracts

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');


require('chai').use(require('chai-as-promised'))
.should()


//owner -> accounts[0] and customer --> accounts[1]
contract('DecentralBank',accounts =>{

    let tether;
    let rwd;
    let decentralBank;

    //helper function to convert amount to wei
    function tokens(number){


        return web3.utils.toWei(number,'ether');

    }

    beforeEach(async () =>{

        //deploy tether contract and get an instance of deployed contract
        tether = await Tether.new();

        //deploy reward contract and get an instance of deployed contract
        rwd = await RWD.new();

        //deploy decentralBank contract and get an instance of deployed contract
        decentralBank = await DecentralBank.new(rwd.address,tether.address);


        //transfer all tokens to decentral bank (1 million)
        await rwd.transfer(decentralBank.address,tokens('1000000'));


        //transfer 100 mock tethers to investor
        await tether.transfer(accounts[1],tokens('100'),{

            from: accounts[0]
        });

    });


    //describe the test suite
    describe('Mock Tether Deployement',async () =>{

        //describe the test
        it('matches name successfully', async()=>{


            //invoke name function of contract
            const name = await tether.name();

            //assert
            assert.equal(name,'Tether')
        });
    });

    //describe the test suite
    describe('Reward Token Deployement',async () =>{

        //describe the test
        it('matches name successfully', async()=>{

            //invoke name function of contract
            const name = await rwd.name();

            //assert
            assert.equal(name,'Reward Token')
        });
    });

    //describe the test suite
    describe('Decentral Bank Deployment',async () =>{

        //describe the test
        it('matches name successfully', async()=>{

            //invoke name function of contract
            const name = await decentralBank.name();

            //assert
            assert.equal(name,'Decentral Bank')
        });

        it('contract has tokens',async()=>{

            //invoke balanceOf function of reward contract
            let balance = await rwd.balanceOf(decentralBank.address);

            //assert
            assert.equal(balance, tokens('1000000'))


        });
    });
    describe('Yield Farming',async () =>{

        //describe the test
        it('reward tokens for staking', async()=>{


            let result;

            //check investor balance
            result = await tether.balanceOf(accounts[1]);


            assert.equal(result.toString(),tokens('100'),'customer mock wallet balance before staking');

            //approval
            await tether.approve(decentralBank.address,tokens('100'),{from: accounts[1]})

            //stake 100 tokens
            await decentralBank.depositTokens(tokens('100'), { from: accounts[1]});

            //check updated balance of customer
            result = await tether.balanceOf(accounts[1]);
            assert.equal(result.toString(),tokens('0'),'customer mock wallet balance after staking 100 tokens');

            //check updated balance of decentral bank
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(),tokens('100'),'decentral bank mock wallet balance after staking from customer wallet');

            //is staking balance
            result = await decentralBank.isStaking(accounts[1]);
            assert.equal(result.toString(),'true','customer is staking status after staking');


            //issue reward tokens
            await decentralBank.issueTokens({from: accounts[0]});

            //ensure only owner can issue reward tokens
            await decentralBank.issueTokens({from: accounts[1]}).should.be.rejected;


            //unstake tokens
            await decentralBank.unstakeTokens({ from: accounts[1] });

            //check unstaking balance
            result = await tether.balanceOf(accounts[1]);

            assert.equal(result.toString(),tokens('100'),'customer mock wallet balance after unstaking tokens');

            //check update balance of decentral bank
            result = await tether.balanceOf(decentralBank.address);

            assert.equal(result.toString(),tokens('0'),'decentral bank balance after unstaking tokens');

            //is staking update
            result  = await decentralBank.isStaking(accounts[1]);

            assert.equal(result.toString(),'false','customer is staking status after unstaking tokens');

        });
    });
});