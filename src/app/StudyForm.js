import React, {Component} from 'react';
import NiceTextField from './components/NiceTextField';
import SelectField from 'material-ui/SelectField';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Snackbar  from 'material-ui/Snackbar';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconDrag from 'material-ui/svg-icons/editor/drag-handle';
import shortid from 'shortid';
import {Grid, Row, Col} from 'react-flexbox-grid';
import request from 'superagent';
import {browserHistory, Router, Route, IndexRoute } from 'react-router';
import Dropzone from 'react-dropzone';

class NiceImage extends Component {
    srcUpdate(url){
        this.setState({src: url})
    }
    constructor(props, context){
        super(props, context);
        this.state ={
            src: ''
        };
    }
    render(){
        return <div><img style={{maxWidth:'100%'}} src={this.state.src} alt="" /></div>
    }
}
class StudyForm extends Component {
    constructor(props, context){
        super(props, context);
        let studySet = [];
        for (var i = 0; i < 3; i++){
            studySet.push({id: shortid.generate(), term: '', definition: ''});
        }
        this.state ={
            studySet: studySet,
            showErrorMessage: false,
            studyImage: ''
        };
        this.fieldsMap = {};
    }

    handleAddMore = (event) => {
        var studySet = this.state.studySet;
        studySet.push({id: shortid.generate(), term: '', definition: ''});
        this.setState({
            studySet: studySet
        });
    }

    componentDidMount(){
        var that = this;
        this.state.studySet.forEach((item) => {
            that.fieldsMap[item.id].term.setValue(item.term);
            that.fieldsMap[item.id].definition.value = item.definition;
        })
    }

    handleDelete(id){
        var studySet = this.state.studySet;
        var newSet = studySet.filter((item) => {
            return item.id != id;
        });
        this.setState({
            studySet: newSet
        })
    }

    handleFieldChange (event, newValue, item, prop){
        item[prop] = newValue;
    }
    handleSave (){
        var quizToken = window.localStorage.getItem('quizToken');
        if (!quizToken){
            return;
        }

        if (this.validateForm()) {
            var data = {
                title: this.title.getValue(),
                termLanguage: this.state.termLanguage,
                definitionLanguage: this.state.definitionLanguage,
                sets: this.state.studySet,
                image: this.state.studyImage
            };
            request
                .post('/api/v1/sets')
                .set('QUIZ-TOKEN', quizToken)
                .send(data)
                .end(function(err, res){
                    if (err) {
                    } else {
                        browserHistory.push('/myLearning');
                    }
                });
        }

    }
    validateForm(){
        this.setState({submitted: true});
        this.title.setState({errorText: ''});
        var title = this.title.getValue();
        var termLanguage = this.termLanguage.props.value;
        var definitionLanguage = this.definitionLanguage.props.value;
        if (!title){
            this.title.setState({errorText: 'Title could not be empty'});
            return false;
        }

        if (!termLanguage || !definitionLanguage){
            return false;
        }

        return true;
    }

    onDrop(files){
        var quizToken = window.localStorage.getItem('quizToken');
        if (!quizToken){
            return;
        }
        var that = this;
        var formData = new FormData();
        files.forEach(function(file, index){
            formData.append('file'+index, file);
        });
        request
            .post('/api/v1/sets/upload')
            .set('QUIZ-TOKEN', quizToken)
            .send(formData)
            .end(function(err, res){
                if (err) {
                    that.setState({showErrorMessage: true});
                } else {
                    that.setState({studyImage: res.body.data.filename})
                    that.thumbImage.srcUpdate(res.body.data.filename);
                }
            });
    }
    render(){
        const lists = this.state.studySet.map((item, index) =>
                <Row key={item.id}>
                    <Col sm={4}>
                        <NiceTextField onChange={(event, newValue) => {this.handleFieldChange(event, newValue, item, 'term')}} ref={(input) => { this.fieldsMap[item.id] = {term: input}; }} floatingLabelText="Term" fullWidth={true} type="text" hintText="Example: Hello"/><br />
                    </Col>
                    <Col sm={1} />
                    <Col sm={4}>
                        <NiceTextField onChange={(event, newValue) => {this.handleFieldChange(event, newValue, item, 'definition')}} ref={(input) => { this.fieldsMap[item.id].definition = input; }} floatingLabelText="Definition" fullWidth={true} type="text" hintText="Example: Xin chào"/><br />
                    </Col>
                    <Col sm={2}>
                        <FlatButton
                            icon={<IconDelete />}
                            onTouchTap={() => {this.handleDelete(item.id)}}
                            style={{marginTop: '20px'}}
                            />
                    </Col>
                </Row>
        );
        return <div>
            <Grid>
                <Row>
                    <Col sm={8}>
                        <div>
                            <h1>Create a new study set</h1>
                            <NiceTextField ref={(input) => { this.title = input; }} floatingLabelText="Enter title" fullWidth={true} type="text" hintText="Title"/><br />
                            <h4>Image</h4>
                            <Row>
                                <Col sm={6}>
                                    <Dropzone onDrop={this.onDrop.bind(this)}>
                                        <div style={{textAlign: 'center', paddingTop: '30px'}}>Try dropping some files here, or click to select files to upload.</div>
                                    </Dropzone>
                                </Col>
                                <Col sm={6}>
                                    <NiceImage ref={(img) => this.thumbImage = img} src={this.state.studyImage} />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <RaisedButton
                            label="Save"
                            onTouchTap={this.handleSave.bind(this)}
                            style={{marginTop: '20px', float: 'right'}}
                            secondary={true}
                            />
                    </Col>
                </Row>
                <Row >
                    <Col sm={6}>
                        <h4>Terms</h4>
                        <SelectField
                            errorText={!this.state.termLanguage && this.state.submitted? 'Term language could not be empty' : null}
                            floatingLabelText="Language"
                            value={this.state.termLanguage}
                            ref={(input) => this.termLanguage = input}
                            onChange={(event, index, value)=>{this.setState({termLanguage: value})}}
                            >
                            <MenuItem value={"en"} primaryText="English" />
                            <MenuItem value={"vi"} primaryText="Vietnamese" />
                        </SelectField>
                        <br />
                    </Col>
                    <Col sm={6}>
                        <h4>Definitions</h4>

                        <SelectField
                            floatingLabelText="Language"
                            errorText={!this.state.definitionLanguage && this.state.submitted? 'Definition language could not be empty' : null}
                            ref={(input)=> this.definitionLanguage = input}
                            value={this.state.definitionLanguage}
                            onChange={(event, index, value)=>{this.setState({definitionLanguage: value})}}
                            >
                            <MenuItem value={"en"} primaryText="English" />
                            <MenuItem value={"vi"} primaryText="Vietnamese" />
                        </SelectField>
                        <br />
                    </Col>
                </Row>
                {lists}
                <Row >
                    <Col sm={12}>
                        <RaisedButton
                            label="Add more"
                            onTouchTap={this.handleAddMore}
                            style={{marginTop: '20px'}}
                            primary={true}
                            />
                    </Col>
                </Row>
            </Grid>

            <Snackbar
                open={this.state.showErrorMessage}
                message="Upload error"
                autoHideDuration={4000}
                />
        </div>;
    }
}

export default StudyForm;