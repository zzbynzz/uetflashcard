import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
class NiceTextField extends TextField{
    setValue (value){
        var hasValue = !!value;
        this.setState({
            hasValue: hasValue
        });
        this.input.value = value;
    }
}
export default NiceTextField;