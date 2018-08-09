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
            boxOpening: null,
            allBoxes: []
        };
    }

    switchPage = (page) => {
        this.setState({ currentPage: page });
        window.scrollTo(0, 0);
    }

    openBoxDetailPage = (boxId, allBoxes) => {
        this.setState({ currentPage: 4, boxOpening: boxId, allBoxes: allBoxes });
        window.scrollTo(0, 0);
    }

    render() {
        switch (this.state.currentPage) {
            case 0:
                return <LoginPage switchPage={this.switchPage}/>;
            case 1:
                return <RegisterPage switchPage={this.switchPage}/>;
            case 2:
                return <HomePage switchPage={this.switchPage} openBox={this.openBoxDetailPage}/>;
            case 3:
                return <AddBoxPage switchPage={this.switchPage} />;
            case 4:
                return <BoxDetailPage switchPage={this.switchPage} boxId={this.state.boxOpening} allBoxes={this.state.allBoxes}/>;
            default:
                return <p>Under Construction</p>;
        }
    }
}

export default App;
