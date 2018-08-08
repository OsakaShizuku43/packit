import React, { Component } from 'react';
import { Header, List, Button, Transition, Dimmer, Loader, Segment, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import BoxItem from './BoxItem';

class AllItemsInBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            itemSelected: [],
            isMoving: false,
            isConfirmingDeletion: false,
            destinationBox: null
        };
    }

    toggleEditMode() {
        const toggle = { isEditing: !this.state.isEditing, destinationBox: null };
        if (this.state.isEditing) {
            toggle.itemSelected = [];
            toggle.isMoving = false;
            toggle.isConfirmingDeletion = false;
        }
        this.setState(toggle);
    }

    toggleSelectItem(itemId) {
        if (this.state.isEditing === false) return;
        const i = this.state.itemSelected.indexOf(itemId);
        const copy = this.state.itemSelected.slice();
        if (i >= 0) {
            copy.splice(i, 1);
        } else {
            copy.push(itemId);
        }
        this.setState({ itemSelected: copy });
    }

    async deleteSelectedItems() {
        if (this.state.itemSelected.length === 0) return;
        await this.props.deleteSelectedItems(this.state.itemSelected.slice());
        this.toggleEditMode();
    }

    async moveSelectedItems() {
        if (this.state.itemSelected.length === 0) return;
        await this.props.moveSelectedItems(this.state.itemSelected.slice(), this.state.destinationBox);
        this.toggleEditMode();
    }

    render() {
        const boxItems = this.props.items.slice().reverse().map((item) => {
            return (
                <BoxItem
                    itemId={item._id}
                    quantity={item.quantity}
                    name={item.name}
                    category={item.category}
                    key={item._id}
                    beingEdited={this.state.editing}
                    selected={this.state.itemSelected.indexOf(item._id) >= 0}
                    toggleSelectItem={(id) => this.toggleSelectItem(id)} />
            );
        });
        return (
            <Segment>
                <Dimmer inverted active={this.props.isItemLoading && !this.props.isBoxLoading}>
                    <Loader inverted>Loading</Loader>
                </Dimmer>

                <div style={{display: 'inline-block'}}>
                    <Header as="h3" icon="clipboard list" content="All Items" floated="left"/>
                    <div style={{ float: "right" }}>
                        <Button
                            icon={this.state.isEditing ? "close" : "pencil alternate"}
                            circular compact
                            onClick={() => this.toggleEditMode()} disabled={this.props.items.length === 0}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Transition visible={this.state.isEditing} animation="fade right" duration={500}>
                            <div style={{ display: 'inline', float: 'right' }}>
                                <Button
                                    content="Delete" size="small" compact negative
                                    onClick={() => {
                                        this.setState({
                                            isConfirmingDeletion: !this.state.isConfirmingDeletion,
                                            isMoving: false
                                        });
                                    }}/>
                                &nbsp;&nbsp;
                                <Button
                                    content={this.state.isMoving ? 'Cancel' : 'Move'}
                                    size="small" compact primary
                                    onClick={() => {
                                        this.setState({
                                            isMoving: !this.state.isMoving,
                                            isConfirmingDeletion: false,
                                            destinationBox: null
                                        });
                                    }}/>
                            </div>
                        </Transition>
                    </div>
                </div>
                <Transition visible={this.state.isMoving} animation="fade down" duration={250} unmountOnHide>
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <Dropdown
                            placeholder="Select a box" selection options={this.props.boxOptions} style={{ width: '85%' }}
                            onChange={(e, d) => this.setState({ destinationBox: d.value })} />
                        <Button
                            icon="check" size="tiny" compact circular positive style={{ marginLeft: '10px' }}
                            onClick={() => this.moveSelectedItems()}/>
                    </div>
                </Transition>
                <Transition visible={this.state.isConfirmingDeletion} animation="fade down" duration={250} unmountOnHide>
                    <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                        Are you sure?
                        <Button
                            icon="check" compact circular positive style={{ marginLeft: '10px' }}
                            onClick={() => this.deleteSelectedItems()}/>
                        <Button
                            icon="close" compact circular negative style={{ marginLeft: '5px' }}
                            onClick={() => this.setState({ isConfirmingDeletion: false })}/>
                    </div>
                </Transition>
                <div>
                    {this.props.items.length === 0 ?
                        <div style={{textAlign: 'center', color: 'grey'}}>No item</div> :
                        <List divided relaxed>{boxItems}</List>
                    }
                </div>
            </Segment>
        );
    }
}

AllItemsInBox.propTypes = {
    boxId: PropTypes.string,
    isBoxLoading: PropTypes.bool,
    isItemLoading: PropTypes.bool,
    items: PropTypes.array,
    deleteSelectedItems: PropTypes.func,
    moveSelectedItems: PropTypes.func,
    boxOptions: PropTypes.array
};

export default AllItemsInBox;
