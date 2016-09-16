import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as _ from 'lodash';
import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

export class AccountsUIWrapper extends React.Component<{}, {}> {
    componentDidMount() {
        this.view = Blaze.render(Template['loginButtons'],
        ReactDOM.findDOMNode(this.refs.blazeContainer));
    }

    componentWillUnmount() {
        Blaze.remove(this.view);
    }

    render() {
        return <div>
            <div ref="blazeContainer" />
        </div>;
  }
};
