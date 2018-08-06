import React, { Component } from 'react';
import { Header, Button, Transition, Form, Input, Segment, Dropdown, Container, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import categories from '../../categories.json';

class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addingCategory: 'none',
            addingCategoryText: 'None',
            quantity: 1,
            itemName: '',
            imageSelected: null,
            insideBox: null,
            requestPending: false
        };
        this.itemImageInput = null;
        this.imageToUpload = null;
    }

    clearForm() {
        this.setState({ addingCategory: 'none', quantity: 1, itemName: '', imageSelected: null, insideBox: null });
        this.imageToUpload = null;
    }

    uploadImage() {
        if (this.itemImageInput && this.itemImageInput.files[0] !== undefined) {
            this.imageToUpload = this.itemImageInput.files[0];
            this.setState({ imageSelected: this.imageToUpload.name });
        }
    }

    async addItem() {
        if (this.state.itemName.trim() === '') return;
        if (this.state.insideBox === null) return;

        this.setState({ requestPending: true });

        let imageURL;
        if (this.imageToUpload !== null) {
            const data = new FormData();
            data.append('image', this.imageToUpload);
            await fetch('/api/image', {
                method: 'POST',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                body: data
            }).then((resp) => {
                return resp.json();
            }).then((res) => {
                imageURL = res.imageURL;
            }).catch((err) => {
                console.error(err);
            });
        }
        const data = {
            quantity: this.state.quantity,
            category: this.state.addingCategory,
            insideBox: this.state.insideBox,
            name: this.state.itemName
        };
        if (imageURL) data.imageURL = imageURL;
        await fetch('/api/item', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((resp) => {
            return resp.json();
        }).then((res) => {
            this.setState({ requestPending: false, addingCategory: 'none' });
        }).catch((err) => {
            console.error(err);
            this.setState({ requestPending: false });
        });
    }

    showAddItemForm(category) {
        if (this.state.addingCategory === category.value) {
            this.setState({ addingCategory: 'none' });
        } else {
            this.setState({ addingCategory: category.value, addingCategoryText: category.text });
        }
    }

    render() {
        const options = this.props.boxes.map((box) => ({key: box._id, value: box._id, text: box.name}));
        return (
            <div>
                <Header as="h3" icon="plus" content="Add Item" />
                <div style={{ textAlign: 'center' }}>
                    {
                        categories.map((category, index) => {
                            if (index === 0) return null;
                            return (
                                <div style={{ margin: '5px', display: 'inline-block' }} key={index}>
                                    <Button
                                        icon={category.icon}
                                        toggle
                                        active={this.state.addingCategory === category.value}
                                        onClick={() => this.showAddItemForm(category)}
                                        size="massive"
                                        compact/>
                                </div>
                            );
                        })
                    }
                </div>
                <Transition visible={this.state.addingCategory !== 'none'} animation="fade down" duration={500} unmountOnHide onHide={() => this.clearForm()}>
                    <Segment>
                        <Form>
                            <Form.Field inline required>
                                <label>Category</label>
                                <Input
                                    value={this.state.addingCategoryText}
                                    readOnly
                                    transparent/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Name</label>
                                <Input
                                    placeholder="Item name"
                                    onChange={(e) => this.setState({ itemName: e.target.value })}/>
                            </Form.Field>
                            <Form.Field inline required>
                                <label>Quantity</label>
                                <Button.Group size="small">
                                    <Button icon="minus" onClick={() => this.setState({ quantity: Math.max(this.state.quantity - 1, 1) })} />
                                    <Button content={this.state.quantity} />
                                    <Button icon="plus" onClick={() => this.setState({ quantity: this.state.quantity + 1 })} />
                                </Button.Group>
                            </Form.Field>
                            <Form.Field required>
                                <label>In Box</label>
                                <Dropdown
                                    selection
                                    options={options}
                                    onChange={(e, d) => this.setState({ insideBox: d.value })}/>
                            </Form.Field>
                            <Form.Field inline>
                                <label>Image</label>
                                <label className="ui icon button" htmlFor="uploadImage">
                                    <Icon name="upload" /> &nbsp; Upload
                                </label>
                                <input
                                    id="uploadImage"
                                    type="file"
                                    style={{display: "none"}}
                                    onChange={() => this.uploadImage()}
                                    ref={(input) => { this.itemImageInput = input; }}
                                    accept=".jpg, .jpeg, .png"
                                />
                                <span>&nbsp; {this.state.imageSelected}</span>
                            </Form.Field>
                        </Form>
                        <Container style={{textAlign: 'center', marginTop: '10px'}}>
                            <Button onClick={() => this.addItem()} positive loading={this.state.requestPending}>Add</Button>
                        </Container>
                    </Segment>
                </Transition>
            </div>
        );
    }
}

AddItem.propTypes = {
    boxes: PropTypes.array
};

export default AddItem;
