import React, { Component } from 'react';
import { Container, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Boxes from '../home/Boxes';
import SearchItem from '../home/SearchItem';
import AddItem from '../home/AddItem';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifiedLogin: false,
            boxes: []
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token === null) this.props.switchPage(0);
        fetch('/api/user/verify', {
            method: 'POST',
            headers: {
                Authorization: token
            }
        }).then((res) => {
            if (res.status === 200) return res.json();
            throw new Error(401);
        }).then((res) => {
            if (res.error === false) {
                this.setState({ verifiedLogin: true });
                this.getBoxes();
            }
        }).catch(() => this.props.switchPage(0));
    }

    getBoxes() {
        fetch('/api/box', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then((resp) => {
            return resp.json();
        }).then((res) => {
            if (res.error) return console.log('ERROR:', res.message);
            this.setState({ boxes: res.boxes });
        });
    }

    render() {
        if (this.state.verifiedLogin === false) return null;
        return (
            <Container>
                <AddItem boxes={this.state.boxes}/>
                <Divider />
                <SearchItem />
                <Divider />
                <Boxes boxes={this.state.boxes}/>
            </Container>
        );
    }
}

HomePage.propTypes = {
    switchPage: PropTypes.func
};

export default HomePage;
