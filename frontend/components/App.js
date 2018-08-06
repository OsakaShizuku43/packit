import React, { Component } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 2
        };
    }

    switchPage(page) {
        this.setState({ currentPage: page });
    }

    render() {
        switch (this.state.currentPage) {
            case 0:
                return <LoginPage switchPage={(p) => this.switchPage(p)}/>;
            case 1:
                return <RegisterPage switchPage={(p) => this.switchPage(p)}/>;
            case 2:
                return <HomePage switchPage={(p) => this.switchPage(p)}/>;
            default:
                return <p>Under Construction</p>;
        }
    }
}

export default App;
