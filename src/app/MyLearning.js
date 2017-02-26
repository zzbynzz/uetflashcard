import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import StudySets from './StudySets';
class MyLearning extends Component {
    render(){
        return <div>
            <Grid>
                <Row>
                    <Col sm={12}>
                        <h1>My Study Sets</h1>
                    </Col>
                </Row>
            </Grid>
            <StudySets data={[1,2,3,4]} />
        </div>;
    }
}

export default MyLearning;