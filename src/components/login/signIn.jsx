/**
 * @file Handles the modal pop up for sign in.
 * @author Ryan Hiltabrand <ryhiltabrand99@gmail.com>
 */

import React, { Component } from "react";
import "react-table-6/react-table.css";
import Button from "react-bootstrap/Button";
import { Logins } from "./login";

/**
 * @class controls opening and closing modal and rendering it
 */
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LogisOpen: false,
    };
  }

  openLog = () => this.setState({ LogisOpen: true });
  closeLog = () => this.setState({ LogisOpen: false });
 

  handleInputChange(event) {
    const target = event.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.openLog}  active>Login/SignOut</Button>
        
        {this.state.LogisOpen ? (
          <Logins
            closeModal={this.closeLog} 
            isOpen={this.state.LogisOpen}
          />
        ) : null}
        </div>
        );
  }
}

export default SignIn;
