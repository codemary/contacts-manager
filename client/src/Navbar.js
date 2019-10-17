import React, { Component } from 'react';
import { currentUser, logout } from './api';
import { Row, Col, Layout } from 'antd';
import { Link } from "react-router-dom";

const { Header } = Layout;

class Navbar extends Component {

  handleLogout = () => {
    logout()
    this.props.history.push("/");
  }

    render() {
        const isLoggedIn = !!currentUser();
        const url = this.props.match.url;

        const leftMenu = () => {
            const hideMenu = ["/login","/signup"].includes(url);
            if (hideMenu){
              return null
            }
            return (
              <Col> 
                { !isLoggedIn && <Link to="/login">Log In</Link> }
                { isLoggedIn && <Link to="/" onClick={this.handleLogout}>Log Out</Link> }
              </Col>
          )}

        return (
            <Header className="App-header">
                <Row type="flex" justify="space-between"> 
                     <Col > 
                        <Link to="/">Contact Manager</Link> 
                      </Col>
                      {leftMenu()}
                </Row>
            </Header>
        );
    }
}

export default Navbar;