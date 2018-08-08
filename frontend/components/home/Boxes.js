import React, { Component } from 'react';
import { Header, Button, Segment, Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import BoxCard from './BoxCard';

class Boxes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let allBoxes;
        if (this.props.boxes === null) {
            allBoxes = <div style={{ minHeight: '255px' }} />;
        } else if (this.props.boxes.length === 0) {
            allBoxes = <p style={{ textAlign: 'cetner' }}>No boxes available</p>;
        } else {
            allBoxes = (
                <div style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                    {this.props.boxes.slice().reverse().map((box) => (
                        <BoxCard
                            key={box._id}
                            boxId={box._id}
                            name={box.name}
                            description={box.description}
                            imageURL={box.imageURL}
                            openBox={this.props.openBox}/>
                    ))}
                </div>
            );
        }
        return (
            <Segment>
                <Dimmer inverted active={this.props.isBoxesLoading}>
                    <Loader inverted>Loading</Loader>
                </Dimmer>

                <div style={{display: 'inline-block'}}>
                    <Header as="h3" icon="boxes" content="All Boxes" floated="left"/>
                    <Button
                        icon="plus" size="small" style={{ float: 'right' }} circular primary
                        onClick={() => this.props.switchPage(3)}/>
                </div>
                {allBoxes}
            </Segment>
        );
    }
}

Boxes.propTypes = {
    boxes: PropTypes.array,
    switchPage: PropTypes.func,
    openBox: PropTypes.func,
    isBoxesLoading: PropTypes.bool
};

export default Boxes;
