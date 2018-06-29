
const evaluation = {
  /**
 * @description 球队综合能力评估，维度：净胜球	均得	均失 排名	胜场率	平场率	负场率 返回主队胜率和赔率
 * @param {object} h - 主队信息
 * @param {Object} v - 客队信息
 * @return {Object} 返回主队胜率和赔率
 */
  getVddRateOdds(h, v) {
    const weighting = {
      "rank": 0.2,
      "goal_diff": 0.3,
      "score_goals": 0.05,
      "lose_goals": 0.05,
      "victory_rate": 0.2,
      "defeat_rate": 0.2,
    }
    const weighting_average_victory = (h, v) => {
      const rank = (v.rank - h.rank) / 32 * weighting.rank,
      goal_diff = h.goal_diff / (h.goal_diff + v.goal_diff) * weighting.goal_diff,
      score_goals = h.score_goals / (h.score_goals + v.score_goals) * weighting.score_goals,
      lose_goals = (1 - h.lose_goals / (h.lose_goals + v.lose_goals)) * weighting.lose_goals,
      victory_rate = h.victory_rate / ( h.victory_rate + v.victory_rate) * weighting.victory_rate,
      defeat_rate = (1 - h.defeat_rate / ( h.defeat_rate + v.defeat_rate)) * weighting.defeat_rate;
      return  rank + goal_diff + score_goals + lose_goals + victory_rate + defeat_rate;
    }
    const victory = weighting_average_victory(h, v);
    const defeat = weighting_average_victory(v, h);
    const draw = 1 - victory - defeat;
    const rate = {
      victory,
      defeat,
      draw
    }
    const odds = {
      victory: (1 / victory).toFixed(2),
      defeat: (1 / defeat).toFixed(2),
      draw: (1 / draw).toFixed(2)
    } 
    return {
      rate,
      odds
    }
  }
}
export default evaluation;