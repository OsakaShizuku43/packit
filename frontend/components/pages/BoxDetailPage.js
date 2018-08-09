import React, { Component } from 'react';
import { Header, Container, Image, Button, Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AddItem from '../box/AddItem';
import AllItemsInBox from '../box/AllItemsInBox';
import EditBoxModal from '../box/EditBoxModal';

class BoxDetailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boxInfo: null,
            items: [],
            isItemLoading: true,
            allBoxes: this.props.allBoxes.map((box) => {
                const boxInfo = { text: box.name, value: box._id, image: { src: null } };
                boxInfo.image.src = (box.imageURL ? box.imageURL : '/images/default_box.png');
                return boxInfo;
            })
        };
        // Holds information of all boxes for the moving feature (except the current one opening)
        this.allBoxes = [];
        this.props.allBoxes.forEach((box) => {
            if (box._id === this.props.boxId) return;
            const boxInfo = { text: box.name, value: box._id, image: { src: null } };
            boxInfo.image.src = (box.imageURL ? box.imageURL : '/images/default_box.png');
            this.allBoxes.push(boxInfo);
        });
    }

    async componentDidMount() {
        // Get box info
        await this.loadBoxInfo();

        // Get items in box
        fetch('/api/box/' + this.props.boxId + '/items', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((resp) => {
            return resp.json();
        }).then((res) => {
            if (res.error) return;
            this.setState({ items: res.items, isItemLoading: false });
        }).catch((err) => {
            console.error(err);
            this.setState({ isItemLoading: false });
        });
    }

    loadBoxInfo() {
        this.setState({ boxInfo: null });
        fetch('/api/box/' + this.props.boxId, {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        }).catch(() => {
            this.props.switchPage(0);
        }).then((resp) => {
            return resp.json();
        }).then((res) => {
            if (res.error) return console.error(res.error.message);
            this.setState({ boxInfo: res.box });
        });
    }

    prependItemToList(item) {
        const items = this.state.items.slice();
        items.push(item);
        this.setState({ items });
    }

    deleteItemsFromList(itemsToDelete) {
        const items = [];
        this.state.items.forEach(item => {
            if (itemsToDelete.indexOf(item._id) === -1) items.push(item);
        });
        this.setState({ items: items });
    }

    deleteItems(itemsToDelete) {
        this.setState({ isItemLoading: true });
        fetch('/api/item', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: itemsToDelete
            })
        })
            .then(resp => resp.json())
            .then(() => {
                this.deleteItemsFromList(itemsToDelete);
                this.setState({ isItemLoading: false });
            })
            .catch(err => {
                console.error(err);
                this.setState({ isItemLoading: false });
            });
    }

    moveItems(itemsToMove, destination) {
        this.setState({ isItemLoading: true });
        fetch('/api/item/move', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: itemsToMove,
                destination: destination
            })
        })
            .then(resp => resp.json())
            .then(() => {
                this.deleteItemsFromList(itemsToMove);
                this.setState({ isItemLoading: false });
            })
            .catch(err => {
                console.error(err);
                this.setState({ isItemLoading: false });
            });
    }

    render() {
        const { boxInfo } = this.state;
        return (
            <Container>
                <Dimmer inverted active={boxInfo === null}>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
                <Button icon="chevron left" content="Back" primary compact style={{ marginBottom: '5px' }} onClick={() => this.props.switchPage(2)} />
                <div style={{display: 'inline-block'}}>
                    <Header as="h2" floated="left" style={{ marginBottom: '0px' }}>
                        <Image src={boxInfo && boxInfo.imageURL ? boxInfo.imageURL : '/images/default_box.png'} style={{maxHeight: '60px'}}/>
                        {boxInfo ? boxInfo.name : null}
                    </Header>
                    <div style={{ float: 'right', paddingTop: '13px' }}>
                        {boxInfo ? <EditBoxModal boxInfo={boxInfo} refreshBoxInfo={() => this.loadBoxInfo()}/> : null}
                        &nbsp; &nbsp;
                        <Button icon="close" circular onClick={() => alert('Delete!')} negative/>
                    </div>
                </div>
                <AddItem
                    boxId={this.props.boxId}
                    prependItemToList={item => this.prependItemToList(item)} />
                <AllItemsInBox
                    boxId={this.props.boxId}
                    isBoxLoading={boxInfo === null}
                    isItemLoading={this.state.isItemLoading}
                    items={this.state.items}
                    deleteSelectedItems={(items) => this.deleteItems(items)}
                    moveSelectedItems={(items, dest) => this.moveItems(items, dest)}
                    boxOptions={this.allBoxes}/>
            </Container>
        );
    }
}

BoxDetailPage.propTypes = {
    switchPage: PropTypes.func,
    boxId: PropTypes.string,
    allBoxes: PropTypes.array
};

export default BoxDetailPage;
