import * as _ from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Row, Col, Image, Button } from 'react-bootstrap';

import { SetGameState, SetGameStateCollection } from '../lib/set';

declare var Mousetrap: any;

class SetCard extends React.Component<any, any> {
    render() {
        if (this.props.selected) {
            return <Col sm={4}>
                <span>{this.props.cardnum}</span>
                <Image className='glowGreen' src={'/img/' + this.props.card + '.gif'} onClick={this.props.onClick}/> 
            </Col>;
        } else {
            return <Col sm={4}>
                <span>{this.props.cardnum}</span>
                <Image src={'/img/' + this.props.card + '.gif'} onClick={this.props.onClick}/> 
            </Col>;
        }
    }
}

class SetBoard extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            selected: new Array<number>()
        };
    }

    handleSelectCard(cardnum: number) {
        if (_.includes(this.state.selected, cardnum)) {
            this.state.selected.splice(this.state.selected.indexOf(cardnum), 1);
            this.setState({
                selected: this.state.selected
            });
            return;
        }
        if (cardnum < 0 || cardnum >= this.props.state.cards.length)
            return;
        this.state.selected.push(cardnum);
        this.setState({
            selected: this.state.selected
        });
        if (this.state.selected.length == 3) {
            Meteor.call('attemptSet', this.state.selected, 'test');
            this.setState({
                selected: new Array<number>()
            });
        }
    }

    startNew() {
        Meteor.call('startNew', 'test');
    }

    addCards() {
        Meteor.call('addCards', 'test');
    }

    renderCard(cardnum: number) {
        return <SetCard 
            cardnum={cardnum} 
            key={cardnum} 
            card={this.props.state.cards[cardnum]} 
            selected={_.includes(this.state.selected, cardnum)}
            onClick={() => this.handleSelectCard.bind(this)(cardnum)}
        />;
    }

    renderCardRow(grpnum: number) {
        return <Row key={grpnum}>
            {_.range(3).map(i => this.renderCard(grpnum*3 + i))}
        </Row>;
    }

    render() {
        if (this.props.state) {
            return <div id='mainBoard'>
                <Row>
                    <Col sm={6}>
                        Scoreboard or something
                    </Col>
                    <Col sm={6}>
                        {_.range(this.props.state.cards.length / 3).map(this.renderCardRow.bind(this))}
                        <Row>
                            <Button bsStyle='warning' onClick={this.startNew}>Reset Board</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button bsStyle='primary' onClick={this.addCards}>Add Cards</Button>
                        </Row>
                    </Col>         
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