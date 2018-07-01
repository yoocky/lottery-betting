import React, { Component } from 'react';
import logo from './logo.svg';
import { Card, Progress, Collapse, message, Modal, InputNumber, Table, Icon } from 'antd';
import data from './data';
import evaluation from './evaluation';
import 'antd/dist/antd.css';
import './App.css';

const {Panel} = Collapse;
const {Grid} = Card;
const randomCondition = {
  home: {
    luck: 2, // 运气值满分5颗星
    strength: 4 // 现场实力表现
  },
  visiting: {
    luck: 4, // 运气值满分5颗星
    strength: 4 // 现场实力表现
  }
}

const betColumns = [{
  title: '投注内容',
  dataIndex: 'valueName',
  render: (text, record) => <span>{record.typeName}（{text}）</span>,
}, {
  title: '投注倍数',
  dataIndex: 'amount',
}, {
  title: '赔率',
  dataIndex: 'odds',
}, {
  title: '预计奖金',
  render: (record) => <span>{record.odds * record.amount}元（{record.status}）{record.status === '已中奖' ? <Icon type="check" style={{color: 'red'}} /> : null}</span>,
}
];

class App extends Component {
  constructor() {
    super();
    const teams = this.getRandomArrayElements(data.teams, 2);
    this.state = {
      home: teams[0],
      visiting: teams[1],
      currentTime: 0,
      rate: {},
      odds: {},
      goled: {
        home: {
          count: 0,
          times: [],
          rate: 0
        },
        visiting: {
          count: 0,
          times: [],
          rate: 0
        },
      },
      messages: [],
      showBetModal: false,
      bet: {
        type: "",
        typeName:"",
        value: "",
        valueName: "",
        amount: 2,
        odds: 0,
        status: "等待开奖"
      },
      betList: [],
      status: '未开赛',
      result: {}
    }
    this.onChange = this.onChange.bind(this);
    this.bet = this.bet.bind(this);
  }
  componentDidMount() {
    const {rate, odds} = evaluation.getVddRateOdds(this.state.home, this.state.visiting);
    this.setState({rate, odds})
    this.startMatch();
  }

  mockGoleWithGod(time) {
    const homeGoldRate = this.state.rate.victory * randomCondition.home.strength / 5;
    const vistingGoldRate = this.state.rate.defeat * randomCondition.visiting.strength / 5;
    const homeGodRate = Math.random() * randomCondition.home.luck / 5;
    const vistingGodRate = Math.random() * randomCondition.visiting.luck / 5;
    const homeRate = homeGoldRate * homeGodRate;
    const visitingRate = vistingGoldRate * vistingGodRate;
    let msg = '';
    this.state.goled.home.rate = homeRate;
    this.state.goled.visiting.rate = visitingRate;
    if (Math.abs(homeRate - visitingRate) > 0.2) {
      if (homeRate > visitingRate) {
        this.state.goled.home.count++;
        this.state.goled.home.times.push(time);
        msg = `${this.state.home.name}队进球了`;
      } else {
        this.state.goled.visiting.count++;
        this.state.goled.visiting.times.push(time);
        msg = `${this.state.visiting.name}队进球了`;
      }
    }
    if (msg) {
      this.state.messages.push(time + '“' + msg);
      message.info(msg);
    }
    this.forceUpdate()
  }

  lotteryDraw() {
    const result = {};
    const goalDiff = this.state.goled.home.count - this.state.goled.visiting.count;
    if (goalDiff === 0) {
      result.vddValue = "draw";
      result.vddValueName = "平局";
    } else if(goalDiff > 0) {
      result.vddValue = "victory";
      result.vddValueName = "主胜";
    } else {
      result.vddValue = "defeat";
      result.vddValueName = "主负";
    }
    this.state.betList = this.state.betList.map(bet => {
      bet.status = bet.value === result.vddValue ? "已中奖" : "未中奖";
      return bet;
    })
    this.setState({result});
  }

  startMatch() {
    const totalTimes = 90;
    this.setState({status: "进行中"});
    this.setInterval = setInterval(() => {
      this.mockGoleWithGod(this.state.currentTime);
      this.state.currentTime++;
      if (this.state.currentTime === 90) {
        this.endMatch()
      }
      this.forceUpdate()
    }
    , 1000)
  }
  
  endMatch() {
    clearInterval(this.setInterval);
    this.setState({status: "已完赛"});
    this.lotteryDraw();
  }

  // 投注
  handleOk = (e) => {
    this.state.showBetModal = false;
    const bet = Object.assign({}, this.state.bet);
    this.state.betList.push(bet)
  }

  onChange(value) {
    this.state.bet.amount = value;
  }

  handleCancel = (e) => {
    this.state.showBetModal = false;
  }
  
  bet(type, value) {
    if (this.state.status === '已完赛') {
      message.info('投注已截止');
      return false;
    }
    let bet = this.state.bet;
    switch(type) {
      case "vdd":
      bet.typeName = "胜平负";
      break;
    }
    switch(value) {
      case "victory":
      bet.valueName = "主胜";
      break;
      case "draw":
      bet.valueName = "平局";
      break;
      case "defeat":
      bet.valueName = "主负";
      break;
    }
    bet.type = type;
    bet.value = value;
    bet.odds = this.state.odds[value];
    this.setState({bet, showBetModal: true});
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
            <Progress type="circle" percent={(this.state.goled.home.rate * 100).toFixed(2)}/>
          </Grid>
          <Grid className="team score">
            比分：{this.state.goled.home.count}:{this.state.goled.visiting.count}
            <p>{this.state.status}{this.state.result.vddValueName}</p>
            {this.state.messages.map(item=> <p>{item}</p>)}
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
            <Progress type="circle" percent={(this.state.goled.visiting.rate * 100).toFixed(2)}/>
          </Grid>
          <Progress percent={this.state.currentTime * 100 / 90} format={() => `${this.state.currentTime}“`}/>
        </Card>
        <Card title="胜平负">
          <Grid className="vdd" onClick={() => this.bet("vdd", "victory")}>主胜<br/>{this.state.odds.victory}</Grid>
          <Grid className="vdd" onClick={() => this.bet("vdd", "draw")}>平局<br/>{this.state.odds.draw}</Grid>
          <Grid className="vdd" onClick={() => this.bet("vdd", "defeat")}>主负<br/>{this.state.odds.defeat}</Grid>
        </Card>
        <Modal
          title={this.state.bet.typeName}
          visible={this.state.showBetModal}
          onOk={this.handleOk}
          okText="确认投注"
          cancelText="取消"
          onCancel={this.handleCancel}
        >
          <p>投注内容：{this.state.bet.valueName}</p>
          <p>中奖奖金：{this.state.bet.amount * this.state.bet.odds}元</p>
          <p>投注倍数：<InputNumber min={1} max={1000} defaultValue={this.state.bet.amount} onChange={this.onChange} autoFocus={true}/></p>
        </Modal>
        <Table 
          columns={betColumns} 
          dataSource={this.state.betList} 
          size="small" 
          locale={{emptyText: "暂无投注"}}
        />
      </div>
    );
  }
}

export default App;
