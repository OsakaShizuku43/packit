import React, { Component } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class BoxCard extends Component {
    render() {
        return (
            <Card
                style={{ display: 'inline-block', marginLeft: '10px', marginRight: '10px', width: '170px'}}
                onClick={() => this.props.openBox(this.props.boxId)}>
                <Image src={this.props.imageURL ? this.props.imageURL : "/images/default_box.png"} size="small" centered/>
                <Card.Content>
                    <Card.Header>{this.props.name}</Card.Header>
                    <Card.Meta>
                        <span className="date">{this.props.description}</span>
                    </Card.Meta>
                </Card.Content>
                {/* <Card.Content extra>
                    <div className="ui two buttons">
                        <Button basic onClick={() => this.props.openBox(this.props.boxId)}>Open</Button>
                        <Button basic>Modify</Button>
                    </div>
                </Card.Content> */}
            </Card>
        );
    }
}

BoxCard.propTypes = {
    boxId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    imageURL: PropTypes.string,
    openBox: PropTypes.func
};

export default BoxCard;
