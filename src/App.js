/** 
 *  @author yoocky <mengyanzhou@gmail.com>
 *  @description 随机两个球队，给出初盘赔率，模拟比赛和投注
*/
import React, { Component } from 'react';
import { Card, Progress, Collapse, message, Modal, InputNumber, Table, Icon } from 'antd';
import data from './data';
import evaluation from './evaluation';
import 'antd/dist/antd.css';
import './App.css';

const {Panel} = Collapse;
const {Grid} = Card;

// 比赛模拟参数
const mockConfig = {
  fastForwardTimes : 60, // 时间进程加速倍数
  goalDifficultyRate: 0.2 //进球难度系数

}

// 球队实力表现 
const randomCondition = {
  home: {
    luck: 2, // 运气值满分5颗星
    strength: 4 // 现场实力表现
  },
  visiting: {
    luck: 2, // 运气值满分5颗星
    strength: 4 // 现场实力表现
  }
}

// 投注记录Table
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
      home: teams[0],           // 主队数据
      visiting: teams[1],       // 客队数据
      currentTime: 0,           // 比赛进程分钟 上下半场90分钟
      rate: {},                 // 胜平负赛果概率
      odds: {},                 // 胜平负投注概率
      goal: {                   // 进球信息
        home: {                 // 主队进球
          count: 0,             // 主队进球数
          times: [],            // 进球时间节点
          rate: 0               // 实时进球概率
        },
        visiting: {
          count: 0,
          times: [],
          rate: 0
        },
      },
      messages: [],            // 进球历史消息
      showBetModal: false,     // 投注框modal是否展示
      bet: {                   // 投注订单信息
        type: "",              // 玩法
        typeName:"",           // 玩法名称
        value: "",             // 投注内容
        valueName: "",         // 投注内容名称
        amount: 2,             // 投注倍数
        odds: 0,               // 当前赔率
        status: "等待开奖"      // 订单状态
      },
      betList: [],             // 已投注订单列表
      status: '未开赛',         // 比赛状态
      result: {}               // 完赛赛果
    }
  }

  /** 
   * @method
   * @description 数组中随机取出n个值，并返回一个新的数据
   * @param {array} arr - 原数组
   * @param {number} count - 需要随机取出的个数
   * @return {array} 随机生成的新数组
   */
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

  /** 
   * @method
   * @description 双方进球能力的概率碰撞，根据进球难度系数检查是否会产生进球
   * @param {number} time - 当前比赛进行时间
  */
  mockGoleWithGod(time) {
    const homeGoalRate = this.state.rate.victory * randomCondition.home.strength / 5;
    const vistingGoalRate = this.state.rate.defeat * randomCondition.visiting.strength / 5;
    const homeGodRate = Math.random() * randomCondition.home.luck / 5;
    const vistingGodRate = Math.random() * randomCondition.visiting.luck / 5;
    const homeRate = homeGoalRate * homeGodRate;
    const visitingRate = vistingGoalRate * vistingGodRate;
    let msg = '';
    this.state.goal.home.rate = homeRate;
    this.state.goal.visiting.rate = visitingRate;
    if (Math.abs(homeRate - visitingRate) > mockConfig.goalDifficultyRate) {
      if (homeRate > visitingRate) {
        this.state.goal.home.count++;
        this.state.goal.home.times.push(time);
        msg = `${this.state.home.name}队进球了`;
      } else {
        this.state.goal.visiting.count++;
        this.state.goal.visiting.times.push(time);
        msg = `${this.state.visiting.name}队进球了`;
      }
    }
    if (msg) {
      this.state.messages.push(time + '“' + msg);
      message.info(msg);
    }
    this.forceUpdate()
  }

  /** 
   * @method
   * @description 完赛后根据赔率开奖
  */
  lotteryDraw() {
    const result = {};
    const goalDiff = this.state.goal.home.count - this.state.goal.visiting.count;
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

  /** 
   * @method
   * @description 模拟比赛开始
  */
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
    , 60000 / mockConfig.fastForwardTimes)
  }
  
  /** 
   * @method
   * @description 模拟比赛完赛
  */
  endMatch() {
    clearInterval(this.setInterval);
    this.setState({status: "已完赛"});
    this.lotteryDraw();
  }

  // 确认投注
  handleOk = (e) => {
    this.state.showBetModal = false;
    const bet = Object.assign({}, this.state.bet);
    this.state.betList.push(bet)
  }

  // 改变投注倍数
  onChange = (value) => {
    this.state.bet.amount = value;
  }

  // 取消投注
  handleCancel = (e) => {
    this.state.showBetModal = false;
  }
  
  // 打开投注框
  bet = (type, value) => {
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

  componentDidMount() {
    const {rate, odds} = evaluation.getVddRateOdds(this.state.home, this.state.visiting);
    this.setState({rate, odds})
    this.startMatch();
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
            <Progress type="circle" percent={(this.state.goal.home.rate * 100).toFixed(2)}/>
          </Grid>
          <Grid className="team score">
            比分：{this.state.goal.home.count}:{this.state.goal.visiting.count}
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
            <Progress type="circle" percent={(this.state.goal.visiting.rate * 100).toFixed(2)}/>
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
