import React, { Component } from 'react';
import { Header, Container, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import BoxItem from './BoxItem';

class AllItemsInBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    componentDidMount() {
        fetch('/api/box/' + this.props.boxId + '/items', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((resp) => {
            return resp.json();
        }).then((res) => {
            if (res.error) return;
            this.setState({ items: res.items });
        }).catch((err) => {
            console.error(err);
        });
    }

    render() {
        return (
            <div>
                <Header as="h3" icon="clipboard list" content="All Items" />
                <Container>
                    {this.state.items.length === 0 ?
                        <div style={{textAlign: 'center'}}>No Item</div> :
                        <List divided relaxed>
                            {this.state.items.slice().reverse().map((item) => {
                                return <BoxItem itemId={item._id} quantity={item.quantity} name={item.name} category={item.category} key={item._id} />;
                            })}
                        </List>
                    }
                </Container>
            </div>
        );
    }
}

AllItemsInBox.propTypes = {
    boxId: PropTypes.string
};

export default AllItemsInBox;
