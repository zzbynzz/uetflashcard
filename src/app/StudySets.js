import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Grid, Row, Col} from 'react-flexbox-grid';
const style = {
    width: '100%',
    textAlign: 'center',
    marginBottom: '20px'
};

const CardExampleWithAvatar = (props) => {
    const lists = props.data.map((number) =>
            <Col key={number} xs={12} sm={6} md={4} lg={3}>
                <Card  style={style}>
                    <CardMedia
                        overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                        >
                        <img src="http://www.material-ui.com/images/nature-600-337.jpg" />
                    </CardMedia>
                    <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </CardText>
                    <CardActions>
                        <FlatButton label="Action1" />
                        <FlatButton label="Action2" />
                    </CardActions>
                </Card>
            </Col>
    );

    return <Grid style={{marginTop: '20px'}}>
        <Row>{lists}</Row>
    </Grid>;
};

export default CardExampleWithAvatar;