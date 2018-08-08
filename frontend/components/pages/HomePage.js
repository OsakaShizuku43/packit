import React, { Component } from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Boxes from '../home/Boxes';
import SearchItem from '../home/SearchItem';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifiedLogin: false,
            isBoxesLoading: true,
            boxes: null
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
            this.setState({ boxes: res.boxes, isBoxesLoading: false });
        }).catch(err => {
            console.error(err);
        });
    }

    render() {
        return (
            <Container>
                <Header as="h2">
                    <Icon name="home" />
                    <Header.Content>
                        PackIt!
                        <Header.Subheader>Make your moving easier</Header.Subheader>
                    </Header.Content>
                </Header>
                <Boxes
                    boxes={this.state.boxes}
                    switchPage={this.props.switchPage}
                    openBox={(id) => this.props.openBox(id, this.state.boxes)}
                    isBoxesLoading={this.state.isBoxesLoading} />
                <SearchItem />
            </Container>
        );
    }
}

HomePage.propTypes = {
    switchPage: PropTypes.func,
    openBox: PropTypes.func
};

export default HomePage;
