export function getAthleteSummary(wellnessData) {
  // 1. Sort by date (descending) to get the most recent first
  const sorted = [...wellnessData].sort(
    (a, b) => new Date(b.id) - new Date(a.id),
  );

  // 2. Identify "Yesterday" (most recent entry)
  const yesterday = sorted[0];

  // 3. Get the last 14 days for the rolling average (excluding yesterday)
  const last14Days = sorted.slice(1, 15);

  const calculateAvg = (arr, key) => {
    const values = arr.map((day) => day[key]).filter((v) => v != null);
    return values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : null;
  };

  const avgHRV = calculateAvg(last14Days, "hrv");
  const avgRHR = calculateAvg(last14Days, "restingHR");
  const hrvDelta = avgHRV ? ((yesterday.hrv - avgHRV) / avgHRV) * 100 : 0;

  return {
    date: yesterday.id,
    current_vitals: {
      hrv: yesterday.hrv ?? null,
      rhr: yesterday.restingHR ?? null,
      sleep_score: yesterday.sleepScore ?? null,
      tss_load: yesterday.ctlLoad ?? null,
    },
    baseline_14d: {
      avg_hrv: avgHRV != null ? Number(avgHRV.toFixed(1)) : null,
      avg_rhr: avgRHR != null ? Number(avgRHR.toFixed(1)) : null,
    },
    deltas: {
      hrv_percent: avgHRV != null ? hrvDelta.toFixed(1) + "%" : null,
    },
    trends: {
      ctl: yesterday.ctl != null ? Number(yesterday.ctl.toFixed(1)) : null,
      atl: yesterday.atl != null ? Number(yesterday.atl.toFixed(1)) : null,
      ramp_rate: yesterday.rampRate != null ? Number(yesterday.rampRate.toFixed(2)) : null,
    },
  };
}
