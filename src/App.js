import React, { Component } from 'react';
import { WebView, LayoutAnimation } from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Footer,
    FooterTab,
    Button,
    Left,
    Right,
    Body,
    List,
    ListItem,
    H3,
    Text,
    Grid,
    Col,
    Row,
    Icon,
    Spinner
} from 'native-base';

import parseXML from 'react-native-xml2js';

class App extends Component {
    state = {
        headlines: null,
        link: null,
        title: null
    };

    componentWillMount() {
        this.getContent();
    }
    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }
    getContent() {
        fetch('https://www.standardmedia.co.ke/rss/headlines.php')
            .then((response) => response.text())
            .then((textResponse) => {
                parseXML.parseString(textResponse, (err, result) => {
                    this.changeState(result.rss.channel[0].item);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    changeState(result) {
        console.log(result);
        this.setState({headlines: result})
    }
    itemClicked(link) {
        console.log(link);
    }
    renderRow(headline) {
        return (
            <ListItem button onPress= {() => {
                const link = headline.link[0].replace('http://','https://');
                const title = headline.title[0].replace(': ','');
                this.setState({link, title})
            }}>
                <Grid>
                    <Row>
                        <H3 style={{color: '#212121'}}>{headline.title[0].replace(': ','')}</H3>
                    </Row>
                    <Row>
                        <Text style={{marginTop: 8, fontSize: 14, color: '#616161'}}>{headline.description[0]}</Text>
                    </Row>
                    <Row>
                        <Text style={{marginTop: 8, fontSize: 12, color: '#757575'}}>Published on: {headline.pubDate[0]}</Text>
                    </Row>
                </Grid>
            </ListItem>
        );
    }
    renderList() {
        if(this.state.headlines == null) {
            return (
                <Spinner color='#E0E0E0' />
            );
        } else if (this.state.link != null) {
            return (
                <WebView
                    source={{uri: this.state.link}}
                    style = {{flex: 1, height: 1000}}
                />
            );
        } else {
            return (
                <List
                    dataArray = { this.state.headlines }
                    renderRow = { this.renderRow.bind(this) }
                />
            );
        }
    }
    topBackButtonPress() {
        this.setState({link: null, title: null})
    }
    topRefreshButtonPress() {
        this.setState({headlines: null});
        this.getContent();
    }
    generateTopLeftButon() {
        if(this.state.link != null) {
            return <Icon name='arrow-back' />
        }
    }
    generateTopRightButon() {
        if(this.state.link == null) {
            return <Icon name='refresh' />
        }
    }
    generateTitle() {
        if(this.state.title == null) {
            return (
                <Title>KeNews</Title>
            );
        }
        return <Title>{this.state.title}</Title>
    }
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.topBackButtonPress.bind(this)}>
                            {this.generateTopLeftButon()}
                        </Button>
                    </Left>
                    <Body style={{flex:5}}>
                    {this.generateTitle()}
                    </Body>
                    <Right>
                        <Button transparent onPress={this.topRefreshButtonPress.bind(this)}>
                            {this.generateTopRightButon()}
                        </Button>
                    </Right>
                </Header>
                <Content>
                    {this.renderList()}
                </Content>
            </Container>
        );
    }
}

export default App;
