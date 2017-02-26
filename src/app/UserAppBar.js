import React, {Component, PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationHome from 'material-ui/svg-icons/action/home';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {Link } from 'react-router';
import request from 'superagent';
import {browserHistory} from 'react-router';
class Login extends Component {
    static muiName = 'FlatButton';
    static propTypes = {
        successLogin: PropTypes.func.isRequired,
    };
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    constructor(props, context) {
        super(props, context);

        this.state = {
            openSignupModal: false,
            openLoginModal: false,
            openErrorLogin: false
        };
    }

    openSignupModal(){
        this.setState({openSignupModal: true});
    }
    openLoginModal(){
        this.setState({openLoginModal: true});
    }
    hideModal(){
        this.setState({openSignupModal: false, openLoginModal: false});
    }
    validateSignupForm(){
        this.signupEmail.setState({errorText: ''});
        this.signupPassword.setState({errorText: ''});
        this.signupConfirmPassword.setState({errorText: ''});
        var email = this.signupEmail.getValue();
        var password = this.signupPassword.getValue();
        var signupConfirmPassword = this.signupConfirmPassword.getValue();
        if (!email || !this.emailRegex.test(email)){
            this.signupEmail.setState({errorText: 'Email is not valid'});
            return false;
        }
        if (!password || password.length < 6){
            this.signupPassword.setState({errorText: 'Password must have 6 characters'});
            return false;
        }
        if (!signupConfirmPassword || password != signupConfirmPassword){
            this.signupConfirmPassword.setState({errorText: 'Confirm password must match'});
            return false;
        }
        return {emai: email, password: password};
    }
    validateLoginForm(){
        this.loginEmail.setState({errorText: ''});
        this.loginPassword.setState({errorText: ''});
        var email = this.loginEmail.getValue();
        var password = this.loginPassword.getValue();
        if (!email || !this.emailRegex.test(email)){
            this.loginEmail.setState({errorText: 'Email is not valid'});
            return false;
        }
        if (!password || password.length < 6){
            this.loginPassword.setState({errorText: 'Password must have 6 characters'});
            return false;
        }

        return {emai: email, password: password};
    }
    handleSubmitSignup(){
        var formData = this.validateSignupForm();
        if (formData){

        }
    }
    handleSubmitLogin(){
        var formData = this.validateLoginForm();
        if (formData){

        }
    }
    responseFacebook = (response) => {
        var that = this;
        request
            .post('/api/v1/auth')
            .send(response)
            .end(function(err, res){
                if (err) {
                    that.setState({openErrorLogin: true});
                } else {
                    window.localStorage.setItem('quizToken', res.body.data.quizToken);
                    that.props.successLogin(res.body.data.loggedUser);
                }
            });
    }
    responseGoogle = (response) => {
        var that = this;
        var profile = response.profileObj;
        request
            .post('/api/v1/auth')
            .send(profile)
            .end(function(err, res){
                if (err) {
                    that.setState({openErrorLogin: true});
                } else {
                    window.localStorage.setItem('quizToken', res.body.data.quizToken);
                    that.props.successLogin(res.body.data.loggedUser);
                }
            });
    }
    responseGoogleFailure = (response) => {
        console.log(response);
    }
    render() {
        const modalSignupActions = (
            <div>
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onTouchTap={this.hideModal.bind(this)}
                    />
                <FlatButton
                    label="Ok"
                    primary={true}
                    onTouchTap={this.handleSubmitSignup.bind(this)}
                    />
            </div>
        );
        const modalLoginActions = (
            <div>
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onTouchTap={this.hideModal.bind(this)}
                    />
                {/*
                 <FlatButton
                 label="Login"
                 primary={true}
                 onTouchTap={this.handleSubmitLogin.bind(this)}
                 />
                */}
            </div>
        );

        const customContentStyle = {
            width: '300px',
            maxWidth: '100%',
        };

        return (
            <div>
                <RaisedButton style={{color: "#fff"}} secondary={true} label="Login" onTouchTap={this.openLoginModal.bind(this)} />
                <Snackbar
                    open={this.state.openErrorLogin}
                    message="Could not log in. Please try again"
                    autoHideDuration={4000}
                    />
                <Dialog
                    open={this.state.openLoginModal}
                    title="Login"
                    actions={modalLoginActions}
                    contentStyle={customContentStyle}
                    onRequestClose={this.handleRequestClose}
                    >
                    <FacebookLogin
                        appId="1440778346189211"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.responseFacebook.bind(this)}
                        />
                    {<GoogleLogin
                     clientId="266896522149-ka6fin5k7lr8a1vil7h9iu7vbfool9qf.apps.googleusercontent.com"
                     tag="div"
                     className="googleLoginButton"
                     onSuccess={this.responseGoogle.bind(this)}
                     onFailure={this.responseGoogleFailure.bind(this)}
                     />
                     }
                    {/*
                    <TextField ref={(input) => { this.loginEmail = input; }} floatingLabelText="Email" fullWidth={true} type="text" hintText="Email"/><br />
                    <TextField ref={(input) => { this.loginPassword = input; }} fullWidth={true} type="password" hintText="Password"/><br />
                     */}
                </Dialog>
            </div>
        );
    }
}

const Logged = (props) => (
    <div>
        <Link to="/create"><RaisedButton label="Create" secondary={true} style={{marginRight: '30px', float: 'left'}} /></Link>
        <Avatar style={{float: 'left', marginTop: '3px'}}  size={30} src={props.loggedUser.photo} />
        <IconMenu
            iconButtonElement={
          <FlatButton style={{color: "#fff"}} labelPosition="before" label={props.loggedUser.name} icon={<ExpandMore />}></FlatButton>
        }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
            <MenuItem primaryText="" ><Link style={{textDecoration: 'none', color: '#000'}} to="/myLearning">My Study Sets</Link></MenuItem>
            <MenuItem primaryText="Sign out" onTouchTap={props.doLogout}/>
        </IconMenu >
    </div>
);

Logged.muiName = 'IconMenu';

/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */
class UserAppBar extends Component {
    state = {
        logged: false,
        loggedUser: null
    };

    componentDidMount(){
        var that = this;
        var quizToken = window.localStorage.getItem('quizToken');
        if (!quizToken){
            that.setState({logged: false});
            return;
        }
        request
            .get('/api/v1/')
            .set('QUIZ-TOKEN', quizToken)
            .end(function(err, res){
                if (err) {
                    that.setState({logged: false});
                } else {
                    if (res.status){
                        that.setState({logged: true, loggedUser: res.body.data});
                    }
                }
            });
    }

    onSuccessLogin(data){
        this.setState({logged: true, loggedUser: data});
    }

    doLogout(){
        window.localStorage.setItem('quizToken', '');
        this.setState({logged: false});
        browserHistory.push('/')
    }

    render() {
        return (
            <div>
                <AppBar
                    iconElementLeft={<Link to="/"><IconButton style={{color: '#fff'}}><NavigationHome color="#fff"/></IconButton></Link>}
                    iconElementRight={this.state.logged ? <Logged loggedUser={this.state.loggedUser} doLogout={this.doLogout.bind(this)}  /> : <Login successLogin={this.onSuccessLogin.bind(this)} />}
                    />

                {this.props.children}
            </div>
        );
    }
}

export default UserAppBar;