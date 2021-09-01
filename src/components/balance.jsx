/**
 * @file Manages Renders the balance in mturk account
 * @author Ryan Hiltabrand <ryhiltabrand99@gmail.com>
 */

import React, { Component } from "react";
import "../App.css";
import AWS from "aws-sdk";

class AccountBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mturkAccountBalance: null,
    };
  }

  componentDidMount() {
    this.getAccountBalance();
  }

  getAccountBalance() {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "mturk-requester.us-east-1.amazonaws.com"
    });
    
    const mTurkClient = new AWS.MTurk();
    mTurkClient.getAccountBalance((err, data) => {
      if (err) {
        console.warn("Error making the mTurk API call:", err);
        
      } else {
        // The call was a success
        const balance = `${data.AvailableBalance}`;
        this.setState({ mturkAccountBalance: balance });
      }
    });
  }


  render() {
    return (
      <div className="App">
        
        <b>${this.state.mturkAccountBalance} is available</b>
      </div>
    );
  }
}

export default AccountBalance;
