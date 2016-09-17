import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as _ from 'lodash';
import { Accounts } from 'meteor/accounts-base';

declare var Template: any, Blaze: any;
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

export class AccountsUIWrapper extends React.Component<{}, {}> {
    componentDidMount() {
        (this as any).view = Blaze.render(Template['loginButtons'],
        ReactDOM.findDOMNode((this as any).refs.blazeContainer));
    }

    componentWillUnmount() {
        Blaze.remove((this as any).view);
    }

    render() {
        return <div>
            <div ref="blazeContainer" />
        </div>;
  }
};
