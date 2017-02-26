/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {browserHistory, Router, Route, IndexRoute } from 'react-router';
import UserAppBar from './UserAppBar';
import StudySets from './StudySets';
import StudyForm from './StudyForm';
import MyLearning from './MyLearning';
import { createStore } from 'redux';
import actions from './reducers';
import { Provider } from 'react-redux';
const store = createStore(actions);
const muiTheme = getMuiTheme();

class Main extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
        <Provider store={store}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <div>
                <Router history={browserHistory}>
                    <Route path="/" component={UserAppBar}>
                        <IndexRoute component={() => (<StudySets data={[1,2,3,4]} />)} />
                        <Route path="/create" component={() => (<StudyForm />)}/>
                        <Route path="/myLearning" component={() => (<MyLearning />)}/>
                    </Route>
                </Router>
            </div>
          </MuiThemeProvider>
        </Provider>
    );
  }
}
export default Main;
