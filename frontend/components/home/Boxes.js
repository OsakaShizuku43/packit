import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import BoxCard from './BoxCard';

class Boxes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header as="h3" icon="boxes" content="All Boxes" />
                {
                    this.props.boxes.length === 0 ? <p style={{ textAlign: 'center' }}>No box available</p> :
                        <div style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                            {this.props.boxes.map((box) => (
                                <BoxCard
                                    key={box._id}
                                    name={box.name}
                                    description={box.description}
                                    imageURL={box.imageURL}/>
                            ))}
                        </div>
                }
            </div>
        );
    }
}

Boxes.propTypes = {
    boxes: PropTypes.array
};

export default Boxes;
