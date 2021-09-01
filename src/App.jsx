import React, { Component } from "react";
import "./App.css";
import { Auth,Hub  } from "aws-amplify";
import { NavLink, Switch, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/login/protectedRoute";
import { Home, Hits } from "./components/pages/pages";
import SignIn from "./components/login/signIn";

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      authStatus: false,  //Authorization login variable state
    };
    this.listener = this.listener.bind(this); //allows for the use of changing state in function
  }
  componentDidMount() {
    Hub.listen('auth', this.listener);

    Auth.currentAuthenticatedUser()
      .then(() => {
        this.setState({ authStatus: true });
      })
      .catch(() => {
      });
  }
  
  /** 
   * Listens for any authorization change after the first render.
   * Allows for state change on authStatus to allow for a new render.
  */
  listener = (data) => {
    switch (data.payload.event) {
        case 'signIn':
            this.setState({authStatus: true });
            break;
        case 'signOut':
            this.setState({ authStatus: false });
            break;
        default:
          break;
    }
}
  render() {
    
    /**
     * @returns navigation bar for unprotected routes
     */
    const UPNavigation = () => (
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
        </ul>
      </nav>
    );

    /**
     * @returns Unprotected routes
     */
    const Main = () => {
      return (
        <div>
          <UPNavigation />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/Hits" component={Hits} />
          </Switch>
        </div>
      );
    };
   
    if (this.state.authStatus === true) {
      return (
        <div className="app">
          <div><h1>O.D.U. AWSMTURK DEMO <SignIn /> </h1></div>
          <BrowserRouter forceRefresh={false}>
            <ProtectedRoute />
          </BrowserRouter>
        </div>
      );
    } else {
      return (
        <div className="app"> 
          <h1>O.D.U. AWSMTURK DEMO <SignIn /></h1>
          <BrowserRouter forceRefresh={false}>
            <Main />
          </BrowserRouter>
        </div>
      );
    }
  }
}

export default App;
