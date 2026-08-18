export type GatewayScores = Record<string, number>;

export const chooseGatewayOutcome = (
  outcomeIds: string[],
  selections: GatewayScores[]
): string | null => {
  if (outcomeIds.length === 0) return null;

  const totals = new Map(outcomeIds.map((id) => [id, 0]));

  selections.forEach((scores) => {
    Object.entries(scores).forEach(([id, score]) => {
      if (!totals.has(id) || !Number.isFinite(score)) return;
      totals.set(id, (totals.get(id) ?? 0) + score);
    });
  });

  return outcomeIds.reduce((bestId, candidateId) =>
    (totals.get(candidateId) ?? 0) > (totals.get(bestId) ?? 0)
      ? candidateId
      : bestId
  );
};

export const parseGatewayScores = (value: string): GatewayScores =>
  value.split(",").reduce<GatewayScores>((scores, pair) => {
    const [id, rawScore] = pair.split(":");
    const score = Number(rawScore);
    if (id && Number.isFinite(score)) scores[id] = score;
    return scores;
  }, {});
