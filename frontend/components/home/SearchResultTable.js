import React, { Component } from 'react';
import { Grid, Icon, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import categoriesJSON from '../../categories.json';

const categories = {};
categoriesJSON.forEach((category) => {
    categories[category.key] = category;
});

class SearchResultTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const rows = this.props.items.map(item => {
            return (
                <Grid.Row stretched verticalAlign="middle" style={{ padding: '0px', paddingTop: '10px' }} key={item._id}>
                    <Grid.Column width={11}>
                        <Header as="h5">
                            <Icon name={categories[item.category].icon} size="small" />
                            <Header.Content>{item.name}</Header.Content>
                        </Header>
                    </Grid.Column>
                    <Grid.Column width={5} style={{ paddingLeft: '0px' }} verticalAlign="middle" textAlign="center">
                        <Header as="h5">{item.insideBox ? item.insideBox.name : 'N/A'}</Header>
                    </Grid.Column>
                </Grid.Row>
            );
        });
        if (rows.length === 0) {
            return (
                <p style={{ textAlign: 'center', paddingTop: '10px' }}> No result found. </p>
            );
        }
        return (
            <Grid columns={2} padded="vertically">
                <Grid.Row stretched textAlign="center" style={{ paddingBottom: '5px' }}>
                    <Grid.Column width={11}>
                        <Header as="h4">Name</Header>
                    </Grid.Column>
                    <Grid.Column width={5} style={{ paddingLeft: '0px' }}>
                        <Header as="h4">Location</Header>
                    </Grid.Column>
                </Grid.Row>
                {rows}
            </Grid>
        );
    }
}

SearchResultTable.propTypes = {
    items: PropTypes.array
};

export default SearchResultTable;