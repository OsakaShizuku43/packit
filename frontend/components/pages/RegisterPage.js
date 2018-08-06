import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Header, Icon } from 'semantic-ui-react';

class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passwordConfirm: '',
            invitation: ''
        };
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
                        <Button positive>Submit</Button>
                        <Button.Or />
                        <Button onClick={() => this.props.switchPage(0)}>Login</Button>
                    </Button.Group>
                </Container>
            </Container>
        );
    }
}

RegisterPage.propTypes = {
    switchPage: PropTypes.func
};

export default RegisterPage;
