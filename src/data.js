
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
      "name": "德国",
      "rank": 2,
      "goal_diff": 1.4,
      "score_goals": 4,
      "lose_goals": 1.25,
      "victory_rate": 0.9,
      "defeat_rate": 0.0,
      "draw_rate": 0.1,
    },
    {
      "name": "法国",
      "rank": 4,
      "goal_diff": 1.4,
      "score_goals": 1.6,
      "lose_goals": 1.25,
      "victory_rate": 0.5,
      "defeat_rate": 0.2,
      "draw_rate": 0.3,
    }
  ]
}
export default data;