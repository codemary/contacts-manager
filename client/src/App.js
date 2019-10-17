import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Dashboard from './Dashboard';
import Navbar from './Navbar';

const { Content } = Layout;

class App extends Component {

  render() {
    return (
      <div>
        <Router>
          <Layout>
            <Switch>
              <Route path="*" component={Navbar} />
            </Switch>
            <Content className="App">
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/dashboard" component={Dashboard} />
                  </Switch>
            </Content>
          </Layout>
        </Router>
      </div>
    );
  }
}

export default App;
