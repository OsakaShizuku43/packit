import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Header, Icon, Message } from 'semantic-ui-react';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMsg: null,
            loggingIn: false
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token === null) return;
        fetch('/api/user/verify', {
            method: 'POST',
            headers: {
                Authorization: token
            }
        }).then((res) => {
            if (res.status === 200) return res.json();
            throw new Error(401);
        }).then((res) => {
            if (res.error === false) this.props.switchPage(2);
        }).catch(() => { return; });
    }

    login = () => {
        const username = this.state.username;
        const password = this.state.password;
        if (username.trim() === '' || password.trim() === '') {
            this.setState({ errorMsg: 'Please enter your credential' });
            return;
        }

        this.setState({ loggingIn: true });
        fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then((res) => {
            return res.json();
        }).then((res) => {
            if (res.error === false) {
                localStorage.setItem('token', res.token);
                this.props.switchPage(2);
            } else {
                this.setState({ errorMsg: res.message, password: '', loggingIn: false });
            }
        }).catch((err) => {
            console.log(err);
            this.setState({ errorMsg: 'An unexpected error occurred', password: '', loggingIn: false });
        });
    }

    handleUsernameChange = e => this.setState({ username: e.target.value });

    handlePasswordChange = e => this.setState({ password: e.target.value });

    render() {
        return (
            <Container>
                <Container style={{textAlign: 'center'}}>
                    <Header as="h2" icon>
                        <Icon name="box" />
                        Login to PackIt!
                        <Header.Subheader>The handy tool for help when you move to a new place.</Header.Subheader>
                    </Header>
                </Container>
                <Form>
                    <Form.Field>
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleUsernameChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}/>
                    </Form.Field>
                </Form>
                <Container style={{textAlign: 'center', marginTop: '20px'}}>
                    <Button.Group size="large">
                        <Button
                            onClick={this.login}
                            loading={this.state.loggingIn}
                            disabled={this.state.loggingIn}
                            positive>
                            Login
                        </Button>
                        <Button.Or />
                        <Button onClick={() => this.props.switchPage(1)}>Sign Up</Button>
                    </Button.Group>
                    {this.state.errorMsg !== null ?
                        <Message negative>
                            <Message.Header>Cannot Login</Message.Header>
                            <p>{this.state.errorMsg}</p>
                        </Message> : null
                    }
                </Container>
            </Container>
        );
    }
}

LoginPage.propTypes = {
    switchPage: PropTypes.func
};

export default LoginPage;
