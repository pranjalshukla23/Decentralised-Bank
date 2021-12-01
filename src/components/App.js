import React, {Component} from 'react';
import Navbar from "./Navbar";
import './App.css';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main';
import ParticleSettings from './ParticleSettings';


class App extends Component{

    //call this function when page loads
    async UNSAFE_componentWillMount() {

        await this.loadWeb3();

        await this.loadBlockchainData();
    }

    //detect web3 instance of browser
    async loadWeb3(){

        //if we find metamask
        if(window.ethereum){

            //create a web3 instance using window.ethereum provider
            window.web3 = new Web3(window.ethereum);

            //enable web3
            await window.ethereum.enable();
        }

        //if we find web3
        else if (window.web3){

            //create a web3 instance using window.web3.current provider
            window.web3 = new Web3(window.web3.currentProvider)
        }

        //if neither web3 and metamask found
        else{

            window.alert('No ethereum browser detected! You can check out metamask')
        }
    }

    //load blockchain data
    async loadBlockchainData(){

        const web3 = window.web3;

        //getting accounts
        const account = await web3.eth.getAccounts();

        console.log(account);

        this.setState({account:account[0]});

        //get current network id to which metamask is connected if metamask is present
        const networkId = await web3.eth.net.getId();

        //load tether contract

        //get network id property (group of properties inside network id) of contract
        //'5777' : {address:'', networkType: ''}, here 5777 - network id
        //Tether.networks[networkId] = {address:'', networkType: ''}
        const tetherData = Tether.networks[networkId];

        //if network id matches
        if(tetherData){

            //get an instance of tether contract from abi and contract address
            //Tether.networks.networkId,address = 'skdchudcdssid9zx'
            const tether =  new web3.eth.Contract(Tether.abi,tetherData.address);

            this.setState({tether});

            //calling balanceOf method of tether contract
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();

            this.setState({tetherBalance: tetherBalance.toString()});

            console.log(tetherBalance);


        }
        else{

            window.alert('Error! Tether contract not deployed to the detected network');
        }
        //load RWD Contract

        //get network id property (group of properties inside network id) of contract
        //'5777' : {address:'', networkType: ''}, here 5777 - network id

        //RWD.networks[networkId] =  {address:'', networkType: ''}
        const rwdData = RWD.networks[networkId];

        //if network id matches
        if(rwdData){

            //get an instance of rwd contract from abi and contract address
            const rwd =  new web3.eth.Contract(RWD.abi,rwdData.address);

            this.setState({rwd});

            //calling balanceOf method of rwd contract
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();

            this.setState({rwdBalance: rwdBalance.toString()});

            console.log(rwdBalance);

        }
        else{

            window.alert('Error! Reward contract not deployed to the detected network');
        }



        //load Decentral Bank Contract

        //get network id property (group of properties inside network id) of contract

        //'5777' : {address:'', networkType: ''}, here 5777 - network id

        //DecentralBank.networks[networkId] =  {address:'', networkType: ''}
        const decentralBankData = DecentralBank.networks[networkId];

        //if network id matches
        if(decentralBankData){

            //get an instance of decentral bank contract from abi and contract address
            const decentralBank =  new web3.eth.Contract(DecentralBank.abi,decentralBankData.address);

            this.setState({decentralBank});

            //calling stakingBalance method of decentral bank contract
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();

            this.setState({stakingBalance: stakingBalance.toString()});

            console.log(stakingBalance);

        }
        else{

            window.alert('Error! Decentral Bank contract not deployed to the detected network');
        }

        this.setState({loading:false});

    }

    //two functions one that stake and other that unstake
    //leverage our decentral bank contract -  deposit tokens and unstaking

    //------for staking function ----

    // 1. depositTokens -> transferFrom......
    // 2. function approve transaction hash
    // 3. staking function -> decentralBank.depositTokens()

    stakeTokens = (amount) => {
        this.setState({loading: true })
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
                this.setState({loading:false})
            })
        })
    }

    unstakeTokens = () => {
        this.setState({loading: true })
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading:false})
        })
    }

    issueTokens = ()=>{

        let owner = '0x8BC061186298bC0E8867588D070741f8f7f52867';

        this.setState({loading:true});

        this.state.decentralBank.methods.issueTokens().send({ from: owner}).on('transactionHash',(hash)=>{

            this.setState({loading:false})
        })
    }

    constructor(props) {
        super(props);

        //define state
        this.state = {

            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '',
            rwdBalance: '',
            stakingBalance:'',
            loading: true,

        }
    }

    //react code
    render(){

        //storing the content of Main component inside content
        let content;
        {
            this.state.loading ? content =
            <p id='loader' className='text-center' style={{margin:'30px',color:'white'}}>
                LOADING PLEASE...</p>: content=
                <Main

                    tetherBalance = {this.state.tetherBalance}
                    rwdBalance = {this.state.rwdBalance}
                    stakingBalance = {this.state.stakingBalance}
                    stakeTokens = {this.stakeTokens}// creating a property stakeTokens
                    unstakeTokens = {this.unstakeTokens}// creating a property unstakeTokens
                    issueTokens = {this.issueTokens}
                />
        }

        return (
            <div className='App' style={{position:'relative'}}>
                <div style={{position:'absolute'}}>
                    <ParticleSettings/>
                </div>

                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>

                        </main>
                    </div>
                </div>

            </div>

        )
    }
}

export default App;


