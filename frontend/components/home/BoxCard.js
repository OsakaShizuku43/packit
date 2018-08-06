import React, { Component } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class BoxCard extends Component {
    render() {
        return (
            <Card style={{ display: 'inline-block', marginLeft: '10px', marginRight: '10px', maxWidth: '75%'}}>
                <Image src={this.props.imageURL ? this.props.imageURL : "/images/default_box.png"} size="small" centered/>
                <Card.Content>
                    <Card.Header>{this.props.name}</Card.Header>
                    <Card.Meta>
                        <span className="date">{this.props.description}</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <div className="ui two buttons">
                        <Button basic>Open</Button>
                        <Button basic>Modify</Button>
                    </div>
                </Card.Content>
            </Card>
        );
    }
}

BoxCard.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    imageURL: PropTypes.string
};

export default BoxCard;
