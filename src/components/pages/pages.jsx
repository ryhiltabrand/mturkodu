/**
 * @file Manages the rendering of each component on web app
 * @author Ryan Hiltabrand <ryhiltabrand99@gmail.com>
 */

import React, { Component } from "react";
import ListHits from "../viewHits";
import S3upload from "../uploads3";
import AddHit from "../addHitCSV"
import AccountBalance from "../balance";
import Manage from "../managehits";

export function Home() {
  return (
    <div className="home">
      <h1>Welcome to my demo MTURK website</h1>
      <p> Work in Progress</p>
    </div>
  );
}

export class Hits extends Component {
  render() {
    return (
      <div className="hits">
        <ListHits />
      </div>
    );
  }
}

export class HitAdder extends Component {
  render() {
    return (
     <div className="adder">
       <AddHit />
     </div>
    );
  }
}

export class Balance extends Component {
  render() {
    return (
      <div className="balance">
        <h1>Balance</h1>
        <AccountBalance />
      </div>
    );
  }
}

export class ManageAssignments extends Component {
  render() {
    return (
      <div className="manage">
        <h1>Mangage your hits</h1>
        <Manage />
      </div>
    );
  }
}

export class UploadImages extends Component {
  render() {
    return (
      <div className="upload">
        <h1>Upload Images</h1>
        <S3upload />
      </div>
    )
  }
}
