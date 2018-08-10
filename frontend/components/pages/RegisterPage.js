import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Header, Icon, Message } from 'semantic-ui-react';

class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passwordConfirm: '',
            invitation: '',
            errorMsg: null,
            successMsg: false,
            requestPending: false
        };
        this.intervalId = null;
    }

    componentWillUnmount() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    register = () => {
        const { username, password, passwordConfirm, invitation } = this.state;
        if (username.trim() === '' || password.trim() === '') {
            this.setState({
                errorMsg: 'Incomplete user information',
                password: '',
                passwordConfirm: ''
            });
            return;
        }

        if (password !== passwordConfirm) {
            this.setState({
                errorMsg: 'Password must match',
                password: '',
                passwordConfirm: ''
            });
            return;
        }

        this.setState({ requestPending: true, errorMsg: null });

        fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, invitation })
        })
            .then(resp => resp.json())
            .then(res => {
                if (res.error) {
                    return this.setState({
                        errorMsg: res.message,
                        requestPending: false,
                        password: '',
                        passwordConfirm: ''
                    });
                }
                this.intervalId = setTimeout(() => this.props.switchPage(0), 3000);
                this.setState({ successMsg: true  });
            })
            .catch(err => {
                this.setState({
                    errorMsg: err,
                    requestPending: false,
                    password: '',
                    passwordConfirm: ''
                });
            });
    }

    render() {
        return (
            <Container>
                <Container style={{textAlign: 'center'}}>
                    <Header as="h2" icon>
                        <Icon name="box" />
                        Signup for Packit!
                        <Header.Subheader>Start using this handy tool in no time</Header.Subheader>
                    </Header>
                </Container>
                <Form>
                    <Form.Field required>
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={(e) => this.setState({ username: e.target.value })}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={this.state.passwordConfirm}
                            onChange={(e) => this.setState({ passwordConfirm: e.target.value })}/>
                    </Form.Field>
                    <Form.Field required>
                        <label>Invitation Code (Beta)</label>
                        <input
                            type="text"
                            placeholder="Invitation Code"
                            value={this.state.invitation}
                            onChange={(e) => this.setState({ invitation: e.target.value })}/>
                    </Form.Field>
                </Form>
                <Container style={{textAlign: 'center', marginTop: '20px'}}>
                    <Button.Group size="large">
                        <Button
                            positive
                            loading={this.state.requestPending}
                            disabled={this.state.requestPending}
                            onClick={this.register}>Submit</Button>
                        <Button.Or />
                        <Button
                            onClick={() => this.props.switchPage(0)}
                            loading={this.state.requestPending}
                            disabled={this.state.requestPending}>Login</Button>
                    </Button.Group>
                    {this.state.errorMsg !== null ?
                        <Message negative>
                            <Message.Header>Cannot Register</Message.Header>
                            <p>{this.state.errorMsg}</p>
                        </Message> : null
                    }
                    {this.state.successMsg ?
                        <Message positive>
                            <Message.Header>Successful</Message.Header>
                            <p>Thank you for signing up PackIt! We are redirecting you to the login page</p>
                        </Message> : null
                    }
                </Container>
            </Container>
        );
    }
}

RegisterPage.propTypes = {
    switchPage: PropTypes.func
};

export default RegisterPage;
