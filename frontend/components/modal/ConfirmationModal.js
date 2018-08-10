import React, { Component } from 'react';
import { Modal, Button, Header, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ConfirmationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            requestPending: false
        };
    }

    onConfirm = async() => {
        this.setState({ requestPending: true });
        if (this.props.onConfirm) {
            await this.props.onConfirm();
        }
        this.setState({ isOpen: false, requestPending: false });
    }

    onCancel = () => {
        this.setState({ isOpen: false });
        if (this.props.onCancel) this.props.onCancel();
    }

    render() {
        return (
            <Modal
                trigger={this.props.trigger} basic size="small"
                closeOnDimmerClick={false}
                open={this.state.isOpen}
                onOpen={() => this.setState({ isOpen: true })}
                onClose={() => this.setState({ isOpen: false })}>
                {this.props.title ?
                    <Header icon={this.props.icon ? this.props.icon : 'question circle'} content={this.props.title} /> : null}
                <Modal.Content>
                    <h3>{this.props.content}</h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        onClick={this.onConfirm}
                        loading={this.state.requestPending}
                        disabled={this.state.requestPending}
                        inverted>
                        <Icon name="checkmark" /> Yes
                    </Button>
                    <Button
                        color="red"
                        onClick={this.onCancel}
                        loading={this.state.requestPending}
                        disabled={this.state.requestPending}
                        inverted>
                        <Icon name="close" /> No
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

ConfirmationModal.propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    trigger: PropTypes.object
};

export default ConfirmationModal;
