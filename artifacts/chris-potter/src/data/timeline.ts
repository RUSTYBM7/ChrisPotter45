export interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  category: "milestone" | "award" | "role" | "direction" | "personal";
  highlight?: boolean;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    year: "1986",
    title: "Theatre Roots",
    description: "Early stage work across Ontario, honing craft in classical and contemporary theatre productions.",
    category: "milestone",
  },
  {
    id: 2,
    year: "1990",
    title: "Screen Debut",
    description: "First television appearances, building a foundation of on-screen experience in Canadian productions.",
    category: "milestone",
  },
  {
    id: 3,
    year: "1993",
    title: "Kung Fu: The Legend Continues",
    description: "Starring role as Peter Caine. The show ran 4 seasons and became a defining early career breakthrough.",
    category: "role",
    highlight: true,
  },
  {
    id: 4,
    year: "1995",
    title: "Gemini Award Nomination",
    description: "First major industry recognition — nominated for a Gemini Award for Best Performance.",
    category: "award",
    highlight: true,
  },
  {
    id: 5,
    year: "1997",
    title: "Traders",
    description: "Cast as Adam Cunningham in the acclaimed financial drama — a multi-year leading role on Canadian national television.",
    category: "role",
    highlight: true,
  },
  {
    id: 6,
    year: "2002",
    title: "Feature Film Work",
    description: "Expanded to feature films with Perfect Pie and international co-productions, showcasing range beyond television.",
    category: "milestone",
  },
  {
    id: 7,
    year: "2007",
    title: "Heartland Begins",
    description: "Cast as Tim Fleming in CBC's Heartland. What begins as a recurring role evolves into a career-defining 17-season performance.",
    category: "role",
    highlight: true,
  },
  {
    id: 8,
    year: "2009",
    title: "Canadian Screen Nomination",
    description: "Nominated for Best Lead Actor in a Drama Series — recognition for his work on Heartland.",
    category: "award",
    highlight: true,
  },
  {
    id: 9,
    year: "2011",
    title: "First Directing Credit",
    description: "Steps behind the camera for the first time, directing an episode of Heartland. A new chapter begins.",
    category: "direction",
    highlight: true,
  },
  {
    id: 10,
    year: "2014",
    title: "Heartland Goes Global",
    description: "Heartland gains international distribution — Chris Potter's performance reaches audiences in over 100 countries.",
    category: "milestone",
  },
  {
    id: 11,
    year: "2017",
    title: "Family Channel Award",
    description: "Heartland wins Best Family Drama — awarded in recognition of the show's cultural impact and longevity.",
    category: "award",
  },
  {
    id: 12,
    year: "2019",
    title: "Producing Credit",
    description: "Joins Heartland as a producer, cementing his triple role as actor, director, and creative decision-maker on the series.",
    category: "milestone",
    highlight: true,
  },
  {
    id: 13,
    year: "2021",
    title: "Heartland Hits Netflix",
    description: "The series lands on Netflix, introducing Tim Fleming to a new generation of global fans.",
    category: "milestone",
    highlight: true,
  },
  {
    id: 14,
    year: "2022",
    title: "Ride — New Leading Role",
    description: "Takes on the lead role in Ride, a Western drama series demonstrating continued commitment to character-driven storytelling.",
    category: "role",
  },
  {
    id: 15,
    year: "2024",
    title: "Season 17",
    description: "Heartland Season 17 cements Chris Potter as one of the longest-serving leads in Canadian television history.",
    category: "milestone",
    highlight: true,
  },
];

export const awards = [
  {
    year: "2024",
    title: "Heartland — Season 17",
    body: "CBC / Netflix",
    category: "Milestone Season",
  },
  {
    year: "2022",
    title: "Canadian Screen Awards — Nomination",
    body: "Academy of Canadian Cinema & Television",
    category: "Best Lead Actor, Drama",
  },
  {
    year: "2019",
    title: "Family Drama Award",
    body: "Family Channel",
    category: "Outstanding Lead Performance",
  },
  {
    year: "2017",
    title: "Heartland Series Award",
    body: "Leo Awards",
    category: "Best Dramatic Series",
  },
  {
    year: "2011",
    title: "Directing Achievement",
    body: "Directors Guild of Canada",
    category: "First-Time Director Recognition",
  },
  {
    year: "2009",
    title: "Canadian Screen Nomination",
    body: "Academy of Canadian Cinema",
    category: "Best Lead Actor, Drama",
  },
  {
    year: "1995",
    title: "Gemini Award Nomination",
    body: "Academy of Canadian Cinema & Television",
    category: "Best Performance, Drama",
  },
];
