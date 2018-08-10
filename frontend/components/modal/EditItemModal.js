import React, { Component } from 'react';
import { Modal, Button, Form, Input, Container, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import categories from '../../categories.json';

class EditItemModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.item.category,
            name: this.props.item.name,
            quantity: this.props.item.quantity,
            requestPending: false
        };
    }

    handleItemNameChange = e => this.setState({ name: e.target.value });

    handleCategoryChange = (e, d) => this.setState({ category: d.value });

    decrementQuantity = () => this.setState({ quantity: Math.max(this.state.quantity - 1, 1) });

    incrementQuantity = () => this.setState({ quantity: this.state.quantity + 1 });

    editItemSubmit = () => {
        if (this.state.name.trim() === '' || this.state.category === 'none') return;

        this.setState({ requestPending: true });

        fetch('/api/item/' + this.props.item._id, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: this.state.category,
                name: this.state.name,
                quantity: this.state.quantity
            })
        }).then(resp => {
            return resp.json();
        }).then(res => {
            if (res.error) return console.error(res.message);
            this.props.changeItemInList(res.item);
        }).catch(err => {
            console.log(err);
            this.setState({ requestPending: false });
        });
    }

    render() {
        return (
            <Modal
                open={this.props.open}
                onOpen={this.props.onOpen}
                onClose={this.props.onClose}
                closeOnDimmerClick={false}>
                <Modal.Header>Edit Item</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field inline required>
                            <label>Category</label>
                            <Dropdown
                                search
                                selection
                                options={categories}
                                value={this.state.category}
                                onChange={this.handleCategoryChange}/>
                        </Form.Field>
                        <Form.Field inline required>
                            <label>Name</label>
                            <Input
                                placeholder="Item name"
                                value={this.state.name}
                                onChange={this.handleItemNameChange}/>
                        </Form.Field>
                        <Form.Field inline required>
                            <label>Quantity</label>
                            <Button.Group size="small">
                                <Button icon="minus" onClick={this.decrementQuantity} />
                                <Button content={this.state.quantity} />
                                <Button icon="plus" onClick={this.incrementQuantity} />
                            </Button.Group>
                        </Form.Field>
                    </Form>
                    <Container style={{textAlign: 'center', marginTop: '10px'}}>
                        <Button
                            onClick={this.editItemSubmit}
                            loading={this.state.requestPending}
                            disabled={this.state.requestPending}
                            positive>
                            Submit
                        </Button>
                        <Button
                            onClick={this.props.onClose}
                            loading={this.state.requestPending}
                            disabled={this.state.requestPending}
                            content="Cancel"
                            negative />
                    </Container>
                </Modal.Content>
            </Modal>
        );
    }
}

EditItemModal.propTypes = {
    item: PropTypes.object,
    open: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    changeItemInList: PropTypes.func
};

export default EditItemModal;
