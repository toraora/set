import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Grid, Panel, FormControl, Button } from 'react-bootstrap';

import { ChatMessage, ChatMessageCollection } from '../lib/chat';

class ChatPanelProps {
    messages: Array<ChatMessage>;
}

class ChatPanel extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
    }

    handleInput(ev: any) {
        this.setState({
            message: ev.target.value
        });
    }

    handleEnter(ev: any) {
        if (ev.key == 'Enter')
            this.handleSend();
    }

    handleSend() {
        if (this.state.message) {
            Meteor.call('sendMessage', this.state.message, 'test')
            this.setState({
                message: ''
            });
        }
    }

    renderMessage(message: ChatMessage) {
        return <div key={message._id}>
            <hr />
            <span> <b>{message.user} ({message.time.toLocaleTimeString()})</b>: {message.message} </span>
        </div>
    }

    render() {
        return <div id='chatCol'><Panel>
            <Row>
                <Col sm={9}>
                    <FormControl value={this.state.message} onChange={e => this.handleInput.bind(this)(e)} onKeyPress={(e) => this.handleEnter.bind(this)(e)}/>
                </Col>
                <Col sm={3}> 
                    <Button bsStyle='primary' onClick={this.handleSend.bind(this)}>
                        Send
                    </Button> 
                </Col>
            </Row>
            {this.props.messages.map(this.renderMessage)}
        </Panel></div>; 
    }
}

export const ChatPanelContainer = createContainer(() => {
    let chatMessagesHandle = Meteor.subscribe('chatMessages', 'test');
    return {
        messages: ChatMessageCollection.find({}, {sort: {time: -1}}).fetch()
    };
}, ChatPanel);