import * as React from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Grid, Panel, FormControl, Button } from 'react-bootstrap';

import './main.css';
import { AccountsUIWrapper } from './accounts';

class MainPage extends React.Component<any, {}> {
    renderMainArea() {
        if (this.props.user) {
            return <Row id='mainContent'>
                <Col sm={8} > hi! </Col>
                <Col sm={4} id='chatCol'>
                    <ChatPanelContainer />
                    
                </Col>
            </Row>;
        } else {
            return <Row>
                <center> <h3> Log in above! </h3> </center>
            </Row>
        }
    }

    render() {
        return <Grid>
            <Row>
                <Col sm={8}> <h2> Set! </h2> </Col>
                <Col sm={4}> <br /> <AccountsUIWrapper /> </Col>
            </Row>
            <hr />

            {this.renderMainArea()}
        </Grid>;
    }
}

var MainPageContainer = createContainer(() => {
    return {
        user: Meteor.user()
    }
}, MainPage)

// MAIN ENTRYPOINT
Meteor.startup(() => render(<MainPageContainer />, document.getElementById('root')));

class ChatPanel extends React.Component<any, any> {
    handleSend() {
        console.log(this.refs['chatInput']);
    }

    renderMessage(message: any) {
        return <div>
            <hr />
            <span> <b>{message.user} ({message.time})</b>: {message.message} </span>
        </div>
    }

    render() {
        return <Panel>
            <Row>
                <Col sm={9}>
                    <FormControl ref='chatInput' componentClass='input' />
                </Col>
                <Col sm={3}> 
                    <Button bsStyle='primary' onClick={this.handleSend.bind(this)}>
                        Send
                    </Button> 
                </Col>
            </Row>
            {this.props.messages.map(this.renderMessage)}
        </Panel>; 
    }
}

var ChatPanelContainer = createContainer(() => {
    return {
        messages: [{user: "woof", time: "12:00:00", message: "bark bark!"}]
    }
}, ChatPanel)