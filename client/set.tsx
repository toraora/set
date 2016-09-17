import * as _ from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Row, Col, Image, Button } from 'react-bootstrap';

import { SetGameState, SetGameStateCollection } from '../lib/set';

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
    startNew() {
        console.log("woof");
        Meteor.call('startNew', 'test');
    }

    renderCardGroup(grpnum: number) {
        return <Row key={grpnum}>
            <SetCard card={this.props.state.cards[grpnum*4]} />
            <SetCard card={this.props.state.cards[grpnum*4+1]} />
            <SetCard card={this.props.state.cards[grpnum*4+2]} />
            <SetCard card={this.props.state.cards[grpnum*4+3]} />
        </Row>;
    }

    render() {
        console.log(this.props.state);
        if (this.props.state) {
            return <div id='mainBoard'>
                {_.range(this.props.state.cards.length / 4).map(this.renderCardGroup.bind(this))}
                <Row>
                    <Button bsStyle='warning'>Reset Board</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button bsStyle='primary'>Woooooooof!</Button>
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