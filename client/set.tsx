import * as _ from 'lodash';
import * as React from 'react';
import * as Mousetrap from 'mousetrap';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Row, Col, Image, Button } from 'react-bootstrap';

import { SetGameState, SetGameStateCollection } from '../lib/set';

let keymap: { [key: string]: number; } = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
    'i': 8,
    'j': 9,
    'k': 10,
    'l': 11,
    'm': 12,
    'n': 13,
    'o': 14,
    'p': 15,
    'q': 16,
    'r': 17,
    's': 18,
    't': 19,
    'u': 20
};

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
        for (var key in keymap) {
            Mousetrap.bind(key, (e) => this.handleSelectCard.bind(this)(keymap[e.key]));
        }
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

    renderScore(user: string) {
        return <Row key={user}>
            <hr />
            <Col sm={8}>
                <b>{user}</b>
            </Col>
            <Col sm={4}>
                {this.props.state.score[user]}
            </Col>
        </Row>
    }

    render() {
        if (this.props.state) {
            return <Row>
                <Col sm={6}>
                    <Row><Col sm={8}><h4>Name</h4></Col><Col sm={4}><h4>Score</h4></Col></Row>
                    {Object.keys(this.props.state.score).map(this.renderScore.bind(this))}
                </Col>
                <div id='mainBoard'>
                    <Col sm={6}>
                        {_.range(this.props.state.cards.length / 3).map(this.renderCardRow.bind(this))}
                        <Row>
                            <Button bsStyle='warning' onClick={this.startNew}>Reset Board</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button bsStyle='primary' onClick={this.addCards}>Add Cards</Button>
                        </Row>
                    </Col>   
                </div>
            </Row>;
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