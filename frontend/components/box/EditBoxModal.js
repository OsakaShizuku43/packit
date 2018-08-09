import React, { Component } from 'react';
import { Modal, Button, Form, Icon, Image, Container, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class EditBoxModal extends Component {
    constructor(props) {
        super(props);
        const {name, description, imageURL} = this.props.boxInfo;
        this.state = {
            name: name || '',
            description: description || '',
            imageURL: imageURL,
            open: false,
            requestPending: false,
            imageSelected: null,
            errorMsg: null
        };
        this.itemImageInput = null;
        this.imageToUpload = null;
    }

    onClose() {
        const {name, description, imageURL} = this.props.boxInfo;
        this.setState({
            open: false,
            name: name || '',
            description: description || '',
            imageURL: imageURL,
            imageSelected: null,
            errorMsg: null
        });
        this.itemImageInput = null;
        this.imageToUpload = null;
    }

    async editBox() {
        if (this.state.name.trim() === '') return;

        this.setState({ requestPending: true });

        let imageURL;
        let error = false;
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
                this.setState({ requestPending: false, errorMsg: 'Cannot upload image' });
                error = true;
            });
        }
        if (error) return;

        const data = { name: this.state.name, description: this.state.description };
        if (imageURL) data.imageURL = imageURL;
        await fetch('/api/box/' + this.props.boxInfo._id, {
            method: 'PUT',
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((resp) => {
            return resp.json();
        }).then(() => {
            this.setState({ requestPending: false, open: false });
            this.props.refreshBoxInfo();
        }).catch((err) => {
            this.setState({ requestPending: false, errorMsg: err.message });
        });
    }

    uploadImage() {
        if (this.itemImageInput && this.itemImageInput.files[0] !== undefined) {
            this.imageToUpload = this.itemImageInput.files[0];
            this.setState({ imageSelected: this.imageToUpload.name });
        }
    }

    render() {
        return (
            <Modal
                trigger={<Button icon="pencil alternate" circular/>}
                open={this.state.open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.onClose()}>
                <Modal.Header>Change Box Info</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field required>
                            <label>Box name</label>
                            <input
                                type="text"
                                placeholder="Name of the box..."
                                value={this.state.name}
                                onChange={(e) => this.setState({ name: e.target.value })}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Description</label>
                            <input
                                type="text"
                                placeholder="Description..."
                                value={this.state.description}
                                onChange={(e) => this.setState({ description: e.target.value })}/>
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
                            {this.state.imageSelected ? <span>&nbsp; Updated: {this.state.imageSelected}</span> :
                                <Image
                                    size="mini"
                                    src={this.state.imageURL ? this.state.imageURL : '/images/default_box.png'}
                                    style={{ marginLeft: '10px' }}
                                    inline/>
                            }
                        </Form.Field>
                    </Form>
                    <Container style={{textAlign: 'center', marginTop: '20px'}}>
                        <Button onClick={() => this.editBox()} loading={this.state.requestPending} positive>Submit</Button>
                        <Button onClick={() => this.onClose()} negative>Cancel</Button>
                        {this.state.errorMsg !== null ?
                            <Message negative>
                                <Message.Header>Cannot create box</Message.Header>
                                <p>{this.state.errorMsg}</p>
                            </Message> : null
                        }
                    </Container>
                </Modal.Content>
            </Modal>
        );
    }
}

EditBoxModal.propTypes = {
    boxInfo: PropTypes.object,
    refreshBoxInfo: PropTypes.func
};

export default EditBoxModal;
