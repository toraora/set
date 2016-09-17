import * as _ from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Row, Col, Image, Button } from 'react-bootstrap';

import { SetGameState, SetGameStateCollection } from '../lib/set';

class SetCard extends React.Component<any, any> {
    render() {
        var size = 2;
        if (this.props.count > 18)
            size = 1;
        if (this.props.class) {
            return <Col sm={size}>
                <Image className={this.props.class} src={'/img/' + this.props.card + '.gif'} /> 
            </Col>;
        } else {
            return <Col sm={size}>
                <Image src={'/img/' + this.props.card + '.gif'} /> 
            </Col>;
        }
    }
}

class SetBoard extends React.Component<any, any> {
    startNew() {
        Meteor.call('startNew', 'test');
    }

    addCards() {
        Meteor.call('addCards', 'test');
    }

    renderCard(cardnum: number) {
        return <SetCard key={cardnum} card={this.props.state.cards[cardnum]} count={this.props.state.cards.length} />;
    }

    renderCardRow(grpnum: number) {
        let numInRow = this.props.state.cards.length / 3;
        return <Row key={grpnum}>
            {_.range(numInRow).map(i => this.renderCard(grpnum + i*3))}
        </Row>;
    }

    render() {
        if (this.props.state) {
            return <div id='mainBoard'>
                {_.range(3).map(this.renderCardRow.bind(this))}
                <Row>
                    <Button bsStyle='warning' onClick={this.startNew}>Reset Board</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button bsStyle='primary'>Woooooooof!</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button bsStyle='primary' onClick={this.addCards}>Add Cards</Button>
                </Row>
            </div>;
        } else {
            return <div id='pendingStart'>
                <Row>
                    <center>
                        <Button bsStyle='default' onClick={this.startNew}>
                            Start Game!
                        </Button>
                    </center>
                </Row>
            </div>;
        }
    }
}

export var SetBoardContainer = createContainer(() => {
    let stateHandle = Meteor.subscribe('gamestate', 'test');
    return {
        state: SetGameStateCollection.findOne({})
    };
}, SetBoard);