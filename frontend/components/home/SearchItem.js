import React, { Component } from 'react';
import { Header, Form, Input, Dropdown, Container, Button } from 'semantic-ui-react';

import categories from '../../categories.json';

class SearchItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchName: '',
            searchCategory: 'none'
        };
    }

    search() {
        const name = this.state.searchName;
        const category = this.state.searchCategory;
        const queryString = '?name=' + name + (category === 'none' ? '' : '&category=' + category);
        fetch('api/item/search' + queryString, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
            .then((resp) => resp.json())
            .then((res) => console.log(res));
    }

    render() {
        return (
            <div>
                <Header as="h3" icon="search" content="Search Items" />
                <Form>
                    <Form.Field>
                        <Input
                            placeholder="Name..."
                            value={this.state.searchName}
                            onChange={(e) => this.setState({ searchName: e.target.value })}
                            fluid/>
                    </Form.Field>
                    <Form.Field>
                        <Dropdown
                            fluid
                            search
                            selection
                            options={categories}
                            onChange={(e, d) => this.setState({ searchCategory: d.value })}
                            defaultValue="none" />
                    </Form.Field>
                </Form>
                <Container style={{textAlign: 'center', marginTop: '10px'}}>
                    <Button onClick={() => this.search()} primary>Search</Button>
                </Container>
            </div>
        );
    }
}

export default SearchItem;

