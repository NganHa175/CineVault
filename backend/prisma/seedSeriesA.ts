// seedSeriesA.ts — series mẫu s1 → s5 (nguồn: frontend/src/mocks/movies.ts)
import type { SeriesSeed } from "./seedTypes";

export const SERIES_A: SeriesSeed[] = [
  {
    id: "s1", title: "Stranger Things", overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.", poster: "p10", genres: ["Drama", "Horror", "SciFi"], releaseYear: 2016, director: "The Duffer Brothers", cast: [{ name: "Millie Bobby Brown", role: "Eleven" }, { name: "Finn Wolfhard", role: "Mike Wheeler" }], voteAverage: 8.7, popularity: 94.2, trailerId: "b9EkMc79ZSU", featured: true, mode: "LOCKED", preset: 1, unlockHours: 24, seasons: [
      { id: "ss1", no: 1, title: "Season 1", mode: "FREE", preset: 1, unlockHours: 24, episodes: [
        { id: "ep1", no: 1, title: "The Vanishing of Will Byers", overview: "On his way home from a friend's house, young Will sees something terrifying. Nearby, a strange girl is found.", thumb: "p10", minutes: 49, setting: "SEASON" },
        { id: "ep2", no: 2, title: "The Weirdo on Maple Street", overview: "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Eleven struggles to understand the boys' world.", thumb: "p11", minutes: 46, setting: "SEASON" },
        { id: "ep3", no: 3, title: "Holly, Jolly", overview: "An increasingly concerned Joyce makes a startling discovery. Meanwhile, Nancy follows a lead to Barb's whereabouts.", thumb: "p12", minutes: 50, setting: "SEASON" },
      ] },
      { id: "ss2", no: 2, title: "Season 2", mode: "LOCKED", preset: 1, unlockHours: 24, episodes: [
        { id: "ep4", no: 1, title: "MADMAX", overview: "A new set of mysteries appears in Hawkins when the kids encounter a strange new girl and Will has another vision of the Upside Down.", thumb: "p13", minutes: 48, setting: "SEASON" },
        { id: "ep5", no: 2, title: "Trick or Treat, Freak", overview: "Eleven searches for her mother. A new threat awakens at Hawkins Lab.", thumb: "p14", minutes: 56, setting: "OVERRIDE", mode: "LOCKED", preset: 2, unlockHours: 48 },
      ] },
    ],
  },
  {
    id: "s2", title: "Breaking Bad", overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.", poster: "p15", genres: ["Crime", "Drama", "Thriller"], releaseYear: 2008, director: "Vince Gilligan", cast: [{ name: "Bryan Cranston", role: "Walter White" }, { name: "Aaron Paul", role: "Jesse Pinkman" }], voteAverage: 9.5, popularity: 97.1, mode: "LOCKED", preset: 2, unlockHours: 48, seasons: [
      { id: "ss3", no: 1, title: "Season 1", mode: "LOCKED", preset: 2, unlockHours: 48, episodes: [
        { id: "ep6", no: 1, title: "Pilot", overview: "Diagnosed with terminal lung cancer, high school chemistry teacher Walter White teams with former student Jesse Pinkman to cook methamphetamine.", thumb: "p15", minutes: 58, setting: "OVERRIDE", mode: "FREE" },
        { id: "ep7", no: 2, title: "Cat's in the Bag", overview: "Walt and Jesse must dispose of the bodies of Emilio and Krazy-8.", thumb: "p16", minutes: 48, setting: "SEASON" },
      ] },
    ],
  },
  {
    id: "s3", title: "Game of Thrones", overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.", poster: "p17", genres: ["Action", "Adventure", "Drama", "Fantasy"], releaseYear: 2011, director: "David Benioff", cast: [{ name: "Emilia Clarke", role: "Daenerys Targaryen" }, { name: "Kit Harington", role: "Jon Snow" }], voteAverage: 9.2, popularity: 98.6, featured: true, mode: "LOCKED", preset: 2, unlockHours: 72, seasons: [
      { id: "ss4", no: 1, title: "Season 1", mode: "LOCKED", preset: 2, unlockHours: 72, episodes: [
        { id: "ep8", no: 1, title: "Winter Is Coming", overview: "Eddard Stark is torn between his family and an old friend's request to serve at the new king's court.", thumb: "p17", minutes: 62, setting: "OVERRIDE", mode: "FREE" },
        { id: "ep9", no: 2, title: "The Kingsroad", overview: "Ned and his daughters travel south; Jon goes north to the Wall; Daenerys adjusts to her new life with the Dothraki.", thumb: "p18", minutes: 56, setting: "SEASON" },
      ] },
    ],
  },
  {
    id: "s4", title: "Squid Game", overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.", poster: "ms72", genres: ["Action", "Drama", "Thriller"], releaseYear: 2021, director: "Hwang Dong-hyuk", cast: [{ name: "Lee Jung-jae", role: "Seong Gi-hun" }], voteAverage: 8.0, popularity: 93.5, mode: "LOCKED", preset: 1, unlockHours: 24, seasons: [
      { id: "ss5", no: 1, title: "Season 1", mode: "LOCKED", preset: 1, unlockHours: 24, episodes: [
        { id: "ep10", no: 1, title: "Red Light, Green Light", overview: "Desperate for money, Gi-hun agrees to take part in an enigmatic game. Not long into the first round, the true dangers of the situation are revealed.", thumb: "ms72", minutes: 60, setting: "OVERRIDE", mode: "FREE" },
        { id: "ep11", no: 2, title: "Hell", overview: "The players awaken in a large dormitory. As they grapple with what happened, a man named Oh Il-nam is piggy-backed by Gi-hun.", thumb: "ms73", minutes: 63, setting: "SEASON" },
      ] },
    ],
  },
  {
    id: "s5", title: "Money Heist", overview: "An enigmatic man known as The Professor masterminds a grand heist on the Royal Mint of Spain, recruiting a team of thieves to execute it.", poster: "ms74", genres: ["Action", "Crime", "Drama", "Thriller"], releaseYear: 2017, director: "Álex Pina", cast: [{ name: "Álvaro Morte", role: "The Professor" }], voteAverage: 8.2, popularity: 88.9, mode: "FREE", preset: 1, unlockHours: 24, seasons: [
      { id: "ss6", no: 1, title: "Part 1", mode: "FREE", preset: 1, unlockHours: 24, episodes: [
        { id: "ep12", no: 1, title: "Episode 1", overview: "A mysterious man known as The Professor recruits a team of thieves to carry out an ambitious plan: enter the Royal Mint of Spain and print billions of euros.", thumb: "ms74", minutes: 53, setting: "SEASON" },
      ] },
    ],
  },
];
