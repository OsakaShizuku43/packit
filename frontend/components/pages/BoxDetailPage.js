import React, { Component } from 'react';
import { Header, Container, Image, Divider, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AddItem from '../box/AddItem';
import AllItemsInBox from '../box/AllItemsInBox';

class BoxDetailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boxInfo: null
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
            if (res.error) throw new Error('STOP');

            // Load Box Info
            return fetch('/api/box/' + this.props.boxId, { method: 'GET', headers: { Authorization: 'Bearer ' + token }});
        }).catch(() => {
            this.props.switchPage(0);
        }).then((resp) => {
            return resp.json();
        }).then((res) => {
            if (res.error) return console.error(res.error.message);
            this.setState({ boxInfo: res.box });
        });
    }

    render() {
        return (
            <Container>
                {
                    this.state.boxInfo === null ? 'Loading' :
                        <Header as="h2">
                            <Image src={this.state.boxInfo.imageURL ? this.state.boxInfo.imageURL : '/images/default_box.png'} />
                            {this.state.boxInfo.name}
                        </Header>
                }
                <Container style={{textAlign: 'center', marginTop: '20px'}}>
                    <Button onClick={() => this.props.switchPage(2)} positive>Go Back</Button>
                    &nbsp; &nbsp;
                    <Button negative>Edit</Button>
                </Container>
                <Divider />
                <AddItem boxId={this.props.boxId}/>
                <Divider />
                <AllItemsInBox boxId={this.props.boxId}/>
            </Container>
        );
    }
}

BoxDetailPage.propTypes = {
    switchPage: PropTypes.func,
    boxId: PropTypes.string
};

export default BoxDetailPage;
