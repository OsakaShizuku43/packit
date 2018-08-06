import React, { Component } from 'react';
import { Header, Button  } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import BoxCard from './BoxCard';

class Boxes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div style={{display: 'inline-block'}}>
                    <Header as="h3" icon="boxes" content="All Boxes" floated="left"/>
                    <Button
                        icon="plus" size="small" style={{ float: 'right' }} circular primary
                        onClick={() => this.props.switchPage(3)}/>
                </div>
                {
                    this.props.boxes.length === 0 ? <p style={{ textAlign: 'center' }}>No box available</p> :
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
                }
            </div>
        );
    }
}

Boxes.propTypes = {
    boxes: PropTypes.array,
    switchPage: PropTypes.func,
    openBox: PropTypes.func
};

export default Boxes;
