import * as React from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Grid, Panel, FormControl, Button } from 'react-bootstrap';

import './main.css';
import { AccountsUIWrapper } from './accounts';
import { ChatPanelContainer } from './chat';
import { SetBoardContainer } from './set';

// MAIN ENTRYPOINT
Meteor.startup(() => render(<MainPageContainer />, document.getElementById('root')));

class MainPage extends React.Component<any, {}> {
    renderMainArea() {
        if (this.props.user) {
            return <Row id='mainContent'>
                <Col sm={8} >
                    <SetBoardContainer />
                </Col>
                <Col sm={4}>
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

