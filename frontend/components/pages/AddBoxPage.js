import React, { Component } from 'react';
import { Header, Container, Icon, Form, Button, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AddBoxPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestPending: false,
            name: '',
            description: '',
            imageSelected: null,
            errorMsg: null
        };
        this.itemImageInput = null;
        this.imageToUpload = null;
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
            if (res.error === false) return;
        }).catch(() => this.props.switchPage(0));
    }

    uploadImage() {
        if (this.itemImageInput && this.itemImageInput.files[0] !== undefined) {
            this.imageToUpload = this.itemImageInput.files[0];
            this.setState({ imageSelected: this.imageToUpload.name });
        }
    }

    async createBox() {
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
        const data = { name: this.state.name };
        if (this.state.description.trim() !== '') data.description = this.state.description;
        if (imageURL) data.imageURL = imageURL;
        await fetch('/api/box', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((resp) => {
            return resp.json();
        }).then(() => {
            this.setState({ requestPending: false });
            this.props.switchPage(2);
        }).catch((err) => {
            this.setState({ requestPending: false, errorMsg: err.message });
        });
    }

    render() {
        return (
            <Container>
                <Container style={{textAlign: 'center'}}>
                    <Header as="h2" icon>
                        <Icon name="add square" /> Create a New Box
                    </Header>
                </Container>
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
                        <span>&nbsp; {this.state.imageSelected}</span>
                    </Form.Field>
                </Form>
                <Container style={{textAlign: 'center', marginTop: '20px'}}>
                    <Button.Group size="large">
                        <Button onClick={() => this.createBox()} loading={this.state.requestPending} positive>Create</Button>
                        <Button.Or />
                        <Button onClick={() => this.props.switchPage(2)} loading={this.state.requestPending} negative>Cancel</Button>
                    </Button.Group>
                    {this.state.errorMsg !== null ?
                        <Message negative>
                            <Message.Header>Cannot create box</Message.Header>
                            <p>{this.state.errorMsg}</p>
                        </Message> : null
                    }
                </Container>
            </Container>
        );
    }
}

AddBoxPage.propTypes = {
    switchPage: PropTypes.func
};

export default AddBoxPage;
