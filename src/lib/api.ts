import type { AnalyticsData } from "@/types/analytics";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_DATA: AnalyticsData = {
  kpi: {
    nyMidnightOverlapProb: 78,
    avgNYExpansion: 62,
    currentWinrate: 47,
  },
  sessionDistribution: [
    { session: "Asia",   value: 15, color: "hsl(215,55%,55%)" },
    { session: "London", value: 65, color: "hsl(152,48%,42%)" },
    { session: "NY",     value: 20, color: "hsl(38,60%,50%)"  },
  ],
  volatility: [
    { day: "Jun 1",  pips: 38 },
    { day: "Jun 2",  pips: 54 },
    { day: "Jun 3",  pips: 29 },
    { day: "Jun 4",  pips: 71 },
    { day: "Jun 5",  pips: 62 },
    { day: "Jun 6",  pips: 45 },
    { day: "Jun 7",  pips: 88 },
    { day: "Jun 8",  pips: 33 },
    { day: "Jun 9",  pips: 57 },
    { day: "Jun 10", pips: 76 },
    { day: "Jun 11", pips: 41 },
    { day: "Jun 12", pips: 65 },
    { day: "Jun 13", pips: 52 },
    { day: "Jun 14", pips: 84 },
    { day: "Jun 15", pips: 47 },
  ],
};

// ── API Service ────────────────────────────────────────────────────────────────
export async function fetchMetaApiData(token: string): Promise<AnalyticsData> {
  if (!token || token.trim() === "") {
    return MOCK_DATA;
  }

  try {
    // Replace this URL with the real MetaApi endpoint when available.
    const response = await fetch(
      "https://metaapi.cloud/users/current/accounts",
      {
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.warn("[Analytica] MetaApi returned non-OK status, using mock data.");
      return MOCK_DATA;
    }

    // TODO: Map real API response to AnalyticsData shape.
    // const raw = await response.json();
    // return mapRawToAnalyticsData(raw);

    return MOCK_DATA; // fallback until real mapping is implemented
  } catch (err) {
    console.warn("[Analytica] Fetch failed, using mock data:", err);
    return MOCK_DATA;
  }
}

export { MOCK_DATA };
