### 足彩模拟投注

1、根据球队综合能力评估，维度：净胜球	均得	均失 排名	胜场率	平场率	负场率，根据评价模型开出初盘赔率

      /**
      * @namespace
      * @property {array} teams 球队历史数据
      * @description 球队综合能力评估，维度：净胜球	均得	均失 排名	胜场率	平场率	负场率
      * @property {string} teams.children.name - 球队名称
      * @property {number} teams.children.rank - 球队世界排名
      * @property {number} teams.children.score_goals - 场均进球
      * @property {number} teams.children.lose_goals - 场均失球
      * @property {number} teams.children.goal_diff - 净胜球
      * @property {number} teams.children.victory_rate - 胜场率
      * @property {number} teams.children.draw_rate - 平场率
      * @property {number} teams.children.defeat_rate - 负场率
      */
      const data = {
        "teams": [
          {
            "name": "巴西",
            "rank": 1,
            "goal_diff": 1.7,
            "score_goals": 1.7,
            "lose_goals": 1.26,
            "victory_rate": 0.6,
            "defeat_rate": 0.3,
            "draw_rate": 0.2,
          },
          {
            "name": "德国",
            "rank": 2,
            "goal_diff": 1.6,
            "score_goals": 1.5,
            "lose_goals": 1.25,
            "victory_rate": 0.6,
            "defeat_rate": 0.3,
            "draw_rate": 0.1,
          },
          {
            "name": "法国",
            "rank": 4,
            "goal_diff": 1.5,
            "score_goals": 1.4,
            "lose_goals": 1.25,
            "victory_rate": 0.5,
            "defeat_rate": 0.3,
            "draw_rate": 0.2,
          },

        ]
      }

  2、 模拟比赛

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

  3、根据球队历史表现，当前比赛的实际表现和运气值进行进球的概率碰撞
  
  4、模拟投注下单
  
  5、完赛开奖
