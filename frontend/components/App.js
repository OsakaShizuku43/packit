import React, { Component } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AddBoxPage from './pages/AddBoxPage';
import BoxDetailPage from './pages/BoxDetailPage';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 2,
            boxOpening: null
        };
    }

    switchPage(page) {
        this.setState({ currentPage: page });
        window.scrollTo(0, 0);
    }

    openBoxDetailPage(boxId) {
        this.setState({ currentPage: 4, boxOpening: boxId });
        window.scrollTo(0, 0);
    }

    render() {
        switch (this.state.currentPage) {
            case 0:
                return <LoginPage switchPage={(p) => this.switchPage(p)}/>;
            case 1:
                return <RegisterPage switchPage={(p) => this.switchPage(p)}/>;
            case 2:
                return <HomePage switchPage={(p) => this.switchPage(p)} openBox={(id) => this.openBoxDetailPage(id)}/>;
            case 3:
                return <AddBoxPage switchPage={(p) => this.switchPage(p)} />;
            case 4:
                return <BoxDetailPage switchPage={(p) => this.switchPage(p)} boxId={this.state.boxOpening} />;
            default:
                return <p>Under Construction</p>;
        }
    }
}

export default App;
