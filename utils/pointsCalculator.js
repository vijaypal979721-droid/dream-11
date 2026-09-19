// Fantasy Points Calculation System
export const calculateFantasyPoints = (stats) => {
  let points = 0;

  // Batting Points
  const runs = stats.runs || 0;
  points += runs * 1; // 1 run = 1 pt
  if (stats.fours) points += stats.fours * 1; // Boundary bonus
  if (stats.sixes) points += stats.sixes * 2; // Six bonus
  if (runs >= 50 && runs < 100) points += 8; // Half century bonus
  if (runs >= 100) points += 16; // Century bonus
  if (runs === 0 && stats.isOut && stats.role !== 'BOWLER') points -= 2; // Duck penalty

  // Bowling Points
  const wickets = stats.wickets || 0;
  points += wickets * 25; // 1 Wicket = 25 pts
  if (stats.lbwOrBowled) points += stats.lbwOrBowled * 8; // Bonus for LBW/Bowled
  if (wickets === 3) points += 4; // 3-wicket haul
  if (wickets === 4) points += 8; // 4-wicket haul
  if (wickets >= 5) points += 16; // 5-wicket haul
  if (stats.maidenOvers) points += stats.maidenOvers * 12; // Maiden over bonus

  // Fielding Points
  if (stats.catches) points += stats.catches * 8;
  if (stats.stumbings) points += stats.stumbings * 12;
  if (stats.runOuts) points += stats.runOuts * 6;

  // Captain / Vice-Captain Multiplier
  if (stats.isCaptain) points *= 2;
  if (stats.isViceCaptain) points *= 1.5;

  return points;
};
