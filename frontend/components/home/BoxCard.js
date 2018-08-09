import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function BoxCard(props) {
    return (
        <Card
            style={{ display: 'inline-block', marginLeft: '10px', marginRight: '10px', width: '170px', 'whiteSpace': 'normal'}}
            onClick={() => props.openBox(props.boxId)}>
            <Image src={props.imageURL ? props.imageURL : "/images/default_box.png"} size="small" centered style={{height: '150px'}}/>
            <Card.Content>
                <Card.Header>{props.name}</Card.Header>
                <Card.Meta>
                    <span className="date">{props.description ? props.description : <br/>}</span>
                </Card.Meta>
            </Card.Content>
        </Card>
    );
}

BoxCard.propTypes = {
    boxId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    imageURL: PropTypes.string,
    openBox: PropTypes.func
};

export default BoxCard;
