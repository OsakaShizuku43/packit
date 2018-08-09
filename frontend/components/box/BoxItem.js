import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import categoriesJSON from '../../categories.json';

const categories = {};
categoriesJSON.forEach((category) => {
    categories[category.key] = category;
});

const itemStyle = { padding: '5px' };
const itemSelectedStyle = { padding: '5px', backgroundColor: '#feca57' };

class BoxItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <List.Item
                style={this.props.selected ? itemSelectedStyle : itemStyle}
                onClick={() => this.props.toggleSelectItem(this.props.itemId)}>
                <List.Icon name={categories[this.props.category].icon} size="large" verticalAlign="middle" circular/>
                <List.Content>
                    <List.Header>{this.props.name}</List.Header>
                    <List.Description>x{this.props.quantity}, {categories[this.props.category].text}</List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

BoxItem.propTypes = {
    itemId: PropTypes.string,
    category: PropTypes.string,
    name: PropTypes.string,
    quantity: PropTypes.number,
    selected: PropTypes.bool,
    toggleSelectItem: PropTypes.func
};

export default BoxItem;

