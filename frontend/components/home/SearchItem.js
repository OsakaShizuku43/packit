import React, { Component } from 'react';
import { Header, Form, Input, Dropdown, Container, Button, Segment, Dimmer, Loader } from 'semantic-ui-react';

import categories from '../../categories.json';

import SearchResultTable from './SearchResultTable';

class SearchItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchName: '',
            searchCategory: 'none',
            searchResult: null,
            isSearching: false
        };
    }

    search = () => {
        const name = this.state.searchName;
        const category = this.state.searchCategory;
        if (name.trim().length === 0 && category === 'none') return;

        this.setState({ isSearching: true });

        const queryString = '?name=' + name + (category === 'none' ? '' : '&category=' + category);
        fetch('api/item/search' + queryString, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
            .then((resp) => resp.json())
            .then((res) => {
                this.setState({ searchResult: res.items, isSearching: false, searchName: '' });
            })
            .catch(() => this.setState({ searchResult: null, isSearching: false }));
    }

    handleNameChange = e => this.setState({ searchName: e.target.value });
    handleCategoryChange = (e, d) => this.setState({ searchCategory: d.value });

    render() {
        return (
            <Segment>
                <Dimmer inverted active={this.state.isSearching}>
                    <Loader inverted>Searching</Loader>
                </Dimmer>
                <Header as="h3" icon="search" content="Search Items" style={{ marginTop: '0px' }} />
                <Form>
                    <Form.Field>
                        <Input
                            placeholder="Name..."
                            value={this.state.searchName}
                            onChange={this.handleNameChange}
                            fluid/>
                    </Form.Field>
                    <Form.Field>
                        <Dropdown
                            fluid
                            search
                            selection
                            options={categories}
                            onChange={this.handleCategoryChange}
                            defaultValue="none" />
                    </Form.Field>
                </Form>
                <Container style={{textAlign: 'center', marginTop: '10px'}}>
                    <Button onClick={this.search} primary>Search</Button>
                </Container>
                {this.state.searchResult === null ? null : <SearchResultTable items={this.state.searchResult}/>}
            </Segment>
        );
    }
}

export default SearchItem;

