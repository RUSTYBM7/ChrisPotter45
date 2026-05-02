export interface Quote {
  id: number;
  text: string;
  context?: string;
  year?: string;
  category: "craft" | "life" | "heartland" | "philosophy" | "direction";
}

export const quotes: Quote[] = [
  {
    id: 1,
    text: "I've always been drawn to characters who are complicated — people trying to do right by others while struggling with their own demons. That tension is where the real story lives.",
    context: "On acting and character work",
    year: "2022",
    category: "craft",
  },
  {
    id: 2,
    text: "Tim Fleming isn't just a role I play. He's someone I've grown with, argued with, and come to understand over seventeen years. There's a piece of both of us in every scene.",
    context: "On playing Tim Fleming in Heartland",
    year: "2024",
    category: "heartland",
  },
  {
    id: 3,
    text: "Directing taught me something acting never could — that the whole is always greater than any single performance. The best thing I do in the chair is get out of the way.",
    context: "On his directing work",
    year: "2019",
    category: "direction",
  },
  {
    id: 4,
    text: "Canada gave me my career, my values, and my sense of what stories deserve to be told. I don't take that lightly. Every project has to mean something — to me, or to someone watching at home.",
    context: "On Canadian storytelling",
    year: "2020",
    category: "philosophy",
  },
  {
    id: 5,
    text: "The horses don't care if you're having a bad day. You show up, you're present, you earn their trust — or you don't. That's a pretty good lesson for life and for acting.",
    context: "On working with horses on Heartland",
    year: "2018",
    category: "heartland",
  },
  {
    id: 6,
    text: "I spent years chasing what I thought a career was supposed to look like. Heartland taught me that longevity isn't about chasing — it's about committing, showing up, and doing the work.",
    context: "On career and commitment",
    year: "2023",
    category: "life",
  },
  {
    id: 7,
    text: "Audiences are extraordinarily perceptive. They know when something is real and when something is performance. The best scenes I've ever shot were the ones where I forgot there was a camera.",
    context: "On authenticity in performance",
    year: "2021",
    category: "craft",
  },
  {
    id: 8,
    text: "Behind every great show is a team of people who don't get the credit they deserve. Producing reminded me of that. My name is on the screen. But the work belongs to everyone.",
    context: "On producing",
    year: "2022",
    category: "direction",
  },
];
