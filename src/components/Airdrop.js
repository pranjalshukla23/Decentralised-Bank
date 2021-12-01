import React,{Component} from "react";

class Airdrop extends Component {

    //Airdrop to have a timer that counts down
    //initialise the countdown after the customer has stake a certain amount ... 50
    //timer functionality, countdown, startTimer, state - for time to work

    constructor() {
        super();

        this.state = {

            time: {},
            seconds: 20
        }

        this.timer = 0;

        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    startTimer() {

        if (this.timer === 0 && this.state.seconds > 0) {

            this.timer = setInterval(this.countDown, 1000);

        }
    }

    countDown() {

        //1. countdown one second at a time
        let seconds = this.state.seconds - 1;

        this.setState({

            time: this.secondsToTime(seconds),
            seconds: seconds
        });

        //2. stop counting when we hit zero
        if (seconds === 0) {

            clearInterval(this.timer)
        }

    }

    secondsToTime(secs) {

        let hours, minutes, seconds;

        //20,000 seconds  = how many hours ???
        hours = Math.floor(secs / (60 * 60));

        let divisorForMinutes = secs % (60 * 60);

        minutes = Math.floor(divisorForMinutes / 60);

        let divisorForSeconds = divisorForMinutes % 60;

        seconds = Math.ceil(divisorForSeconds);

        let obj = {

            'h': hours,
            'm': minutes,
            's': seconds
        }

        return obj;
    }

    componentDidMount() {

        let timeLeft = this.secondsToTime(this.state.seconds);

        this.setState({time: timeLeft});

    }

    airdropReleaseTokens(){

        let stakingBalance  = this.props.stakingBalance;

        if(stakingBalance >= '50000000000000000000'){

            this.startTimer();

          //  this.props.reward();


        }


    }

    render() {

        {this.airdropReleaseTokens()}
        return (
            <div style={{color: 'black'}}>
                {this.state.time.m}:{this.state.time.s}
            </div>
        )
    }
}

export default Airdrop;