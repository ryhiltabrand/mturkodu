/**
 * @file Handles the modal pop up and addition of time for a hit
 * @author Ryan Hiltabrand <ryhiltabrand99@gmail.com>
 */

import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import AWS from "aws-sdk";

export default class AddTime extends Component {
  state = { name: null };

  /**
   * @function Handles addition of time by calling mturk api
   * @param {string} hitId - id of hit where assignments will be added
   * @param {int} TimeToBeAdded - ammount of time to be added
   */
  addTime(hitId, TimeToBeAdded) {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
    });

    const mturk = new AWS.MTurk();
    
    var params = {
      ExpireAt: Date.now() / 1000 + Number(TimeToBeAdded),
      HITId: hitId,
    };

    mturk.updateExpirationForHIT(params, function (err, data) {
      if (err) alert('Bad input');
      // an error occurred
      else alert(`You have added ${params.ExpireAt} time to the hit`); // successful response
    });
  }

  handleChange = (e) => {
    const target = e.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {

    this.addTime(e, this.state.TimeToBeAdded);
  };

  render() {

    return (
      <Modal show={this.props.isOpen} onHide={this.props.closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit}>
            <label>
              How Much time do you want to add? <br />
              <input
                name="TimeToBeAdded"
                type="number"
                required
                checked={this.state.TimeToBeAdded}
                onChange={this.handleChange}
              />
            </label>{" "}
            <br />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={() => this.handleSubmit(this.props.hit)}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
