import * as _ from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Row, Col, Grid, Image } from 'react-bootstrap';

class SetCard extends React.Component<any, any> {
    render() {
        if (this.props.class) {
            return <Col sm={3}>
                <Image className={this.props.class} src={'/img/' + this.props.card + '.gif'} /> 
            </Col>;
        } else {
            return <Col sm={3}>
                <Image src={'/img/' + this.props.card + '.gif'} /> 
            </Col>;
        }
    }
}

class SetBoard extends React.Component<any, any> {
    renderCardGroup(grpnum: number) {
        return <Row key={grpnum}>
            <SetCard card={this.props.cards[grpnum*4]} />
            <SetCard card={this.props.cards[grpnum*4+1]} />
            <SetCard card={this.props.cards[grpnum*4+2]} />
            <SetCard card={this.props.cards[grpnum*4+3]} />
        </Row>;
    }

    render() {
        return <div id='mainBoard'>
            {_.range(this.props.cards.length / 4).map(this.renderCardGroup.bind(this))}
        </div>;
    }
}

export var SetBoardContainer = createContainer(() => {
    return {
        cards: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    };
}, SetBoard);