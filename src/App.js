import React, { Component } from 'react';
import logo from './logo.svg';
import { Card, Progress, Collapse } from 'antd';
import data from './data';
import evaluation from './evaluation';
import 'antd/dist/antd.css';
import './App.css';
const {Panel} = Collapse;
const {Grid} = Card;
const randomCondition = {
  home: {
    luck: 5, // 运气值满分5颗星
    strength:4 // 现场实力表现
  },
  visiting: {
    luck: 2, // 运气值满分5颗星
    strength:3 // 现场实力表现
  }
}
class App extends Component {
  constructor() {
    super();
    const teams = this.getRandomArrayElements(data.teams, 2);
    teams[0].goled = 0;
    teams[1].goled = 0;
    this.state = {
      home: teams[0],
      visiting: teams[1], 
      rate: {},
      odds: {}
    }
  }
  componentDidMount() {
    const {rate, odds} = evaluation.getVddRateOdds(this.state.home, this.state.visiting);
    this.setState({rate, odds})
  }
  getRandomArrayElements(arr, count) {
    let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }

  render() {
    return (
      <div className="App">
        <Card title="模拟投注">
          <Grid className="team">
            <Collapse bordered={false} defaultActiveKey={['1']}>
              <Panel header={`主队：${this.state.home.name}`} key="1">
                <p> 排名：{this.state.home.rank}</p>
                <p> 净胜球：{this.state.home.goal_diff}</p>
                <p> 场均进球：{this.state.home.score_goals}</p>
                <p> 场均失球：{this.state.home.lose_goals}</p>
                <p> 胜场率：{this.state.home.victory_rate}</p>
                <p> 平场率：{this.state.home.draw_rate}</p>
                <p> 负场率：{this.state.home.defeat_rate}</p>
              </Panel>
            </Collapse>
          </Grid>
          <Grid className="team score">
            {this.state.home.goled}:{this.state.visiting.goled}
          </Grid>
          <Grid className="team">
            <Collapse bordered={false} defaultActiveKey={['1']}>
              <Panel header={`客队：${this.state.visiting.name}`} key="1">
                <p> 排名：{this.state.visiting.rank}</p>
                <p> 净胜球：{this.state.visiting.goal_diff}</p>
                <p> 场均进球：{this.state.visiting.score_goals}</p>
                <p> 场均失球：{this.state.visiting.lose_goals}</p>
                <p> 胜场率：{this.state.visiting.victory_rate}</p>
                <p> 平场率：{this.state.visiting.draw_rate}</p>
                <p> 负场率：{this.state.visiting.defeat_rate}</p>
              </Panel>
            </Collapse>
          </Grid>
          <Progress percent={30} />
        </Card>
        <Card title="胜平负">
          <Grid className="vdd">主胜<br/>{this.state.odds.victory}</Grid>
          <Grid className="vdd">平局<br/>{this.state.odds.draw}</Grid>
          <Grid className="vdd">主负<br/>{this.state.odds.defeat}</Grid>
        </Card>
      </div>
    );
  }
}

export default App;
