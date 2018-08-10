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
        const { name, quantity, category } = this.props.item;
        return (
            <List.Item
                style={this.props.selected ? itemSelectedStyle : itemStyle}
                onClick={() => this.props.toggleSelectItem(this.props.item)}>
                <List.Icon name={categories[category].icon} size="large" verticalAlign="middle" circular/>
                <List.Content>
                    <List.Header>{name}</List.Header>
                    <List.Description>x{quantity}, {categories[category].text}</List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

BoxItem.propTypes = {
    item: PropTypes.object,
    selected: PropTypes.bool,
    toggleSelectItem: PropTypes.func
};

export default BoxItem;

