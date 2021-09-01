/**
 * @file Manages Protected Routes.
 * @author Ryan Hiltabrand <ryhiltabrand99@gmail.com>
 */

import Amplify, { Auth } from "aws-amplify";
import { Switch, Route, NavLink } from "react-router-dom";
import awsExports from "../../aws-exports";
import React, { Component } from "react";
import { Home, Hits } from "../pages/pages";

import {
  Balance,
  HitAdder,
  ManageAssignments,
  UploadImages,
} from "../pages/pages";

Amplify.configure(awsExports);

/**
 * @class renders protected routes and nav bar for it.
 */
class Protected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authStatus: false
    };
  }
  /**
   * @function does a second check on authentication of current user
   */
  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState({ authStatus: true });
      })
      .catch(() => {
      });
  }

  render() {

    if (this.state.authStatus === true) {
      return (
        <div>
          <Navigation />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/Hits" component={Hits} />
            <Route exact path="/HitAdder" component={HitAdder} />
            <Route exact path="/Balance" component={Balance} />
            <Route exact path="/Manage" component={ManageAssignments} />
            <Route exact path="/Upload" component={UploadImages} />
          </Switch>
        </div>
      );
    } else {
      return null;
    }
  }
}

/**
 * @returns Nav Bar for protected routes
 */
const Navigation = () => (
  <nav>
    <ul>
      <li>
        <NavLink exact activeClassName="current" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink exact activeClassName="current" to="/Hits">
          Hits
        </NavLink>
      </li>
      <li>
        <NavLink exact activeClassName="current" to="/HitAdder">
          Add Hit
        </NavLink>
      </li>
      <li>
        <NavLink exact activeClassName="current" to="/Balance">
          Balance
        </NavLink>
      </li>
      <li>
        <NavLink exact activeClassName="current" to="/Manage">
          Manage
        </NavLink>{" "}
      </li>

    </ul>
  </nav>
);

export default Protected;
