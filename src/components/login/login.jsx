/**
 * @file Produces the visual for login component as wel as calling the aws auth component.
 * @author Ryan Hiltabrand <ryhiltabrand99@gmail.com>
 */

import React, { Component } from "react";
import { Authenticator, Greetings, SignIn} from "aws-amplify-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";

export class Logins extends Component {

  handleChange = (e) => {
    const target = e.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  };

  render() {
    
    return (
      <Modal show={this.props.isOpen} onHide={this.props.closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Authenticator hideDefault={true}>
            <SignIn/>
            <Greetings
              inGreeting={(username) => "Hello " + username}
            />
          </Authenticator>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    );
  }
}