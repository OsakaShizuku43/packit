import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class BoxCard extends Component {
    render() {
        return (
            <Card
                style={{ display: 'inline-block', marginLeft: '10px', marginRight: '10px', width: '170px'}}
                onClick={() => this.props.openBox(this.props.boxId)}>
                <Image src={this.props.imageURL ? this.props.imageURL : "/images/default_box.png"} size="small" centered style={{maxHeight: '150px'}}/>
                <Card.Content>
                    <Card.Header>{this.props.name}</Card.Header>
                    <Card.Meta>
                        <span className="date">{this.props.description ? this.props.description : <br/>}</span>
                    </Card.Meta>
                </Card.Content>
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
