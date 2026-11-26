// seedSeriesB.ts — series mẫu s6 → s9 (nguồn: frontend/src/mocks/movies.ts)
import type { SeriesSeed } from "./seedTypes";

export const SERIES_B: SeriesSeed[] = [
  {
    id: "s6", title: "Wednesday", overview: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.", poster: "ms75", genres: ["Comedy", "Horror", "Drama"], releaseYear: 2022, director: "Tim Burton", cast: [{ name: "Jenna Ortega", role: "Wednesday Addams" }], voteAverage: 8.1, popularity: 91.4, mode: "LOCKED", preset: 1, unlockHours: 24,
    seasons: [
      { id: "ss7", no: 1, title: "Season 1", mode: "LOCKED", preset: 1, unlockHours: 24, episodes: [
        { id: "ep13", no: 1, title: "Wednesday's Child Is Full of Woe", overview: "Wednesday Addams is expelled from school and sent to Nevermore Academy, where she attempts to master her emerging psychic ability.", thumb: "ms75", minutes: 49, setting: "OVERRIDE", mode: "FREE" },
        { id: "ep14", no: 2, title: "Woe Is the Loneliest Number", overview: "Wednesday meets Enid, her assigned roommate and her polar opposite, and navigates Nevermore's social scene.", thumb: "ms76", minutes: 45, setting: "SEASON" },
      ] },
    ],
  },
  {
    id: "s7", title: "The Crown", overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign.", poster: "ms77", genres: ["Drama", "Romance"], releaseYear: 2016, director: "Peter Morgan", cast: [{ name: "Claire Foy", role: "Queen Elizabeth II" }], voteAverage: 8.6, popularity: 79.3, mode: "FREE", preset: 1, unlockHours: 24,
    seasons: [
      { id: "ss8", no: 1, title: "Season 1", mode: "FREE", preset: 1, unlockHours: 24, episodes: [
        { id: "ep15", no: 1, title: "Wolferton Splash", overview: "A young Queen Elizabeth II comes to power.", thumb: "ms77", minutes: 57, setting: "SEASON" },
      ] },
    ],
  },
  {
    id: "s8", title: "Succession", overview: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down from the company.", poster: "p19", genres: ["Drama", "Comedy"], releaseYear: 2018, director: "Jesse Armstrong", cast: [{ name: "Brian Cox", role: "Logan Roy" }], voteAverage: 8.8, popularity: 85.7, mode: "LOCKED", preset: 2, unlockHours: 48,
    seasons: [
      { id: "ss9", no: 1, title: "Season 1", mode: "LOCKED", preset: 2, unlockHours: 48, episodes: [
        { id: "ep16", no: 1, title: "Celebration", overview: "Aging patriarch Logan Roy celebrates his 80th birthday as tensions rise about who will take over the family business.", thumb: "p19", minutes: 55, setting: "OVERRIDE", mode: "FREE" },
        { id: "ep17", no: 2, title: "Shit Show at the Fuck Factory", overview: "Logan's health crisis sparks a power struggle among his four children.", thumb: "p20", minutes: 54, setting: "SEASON" },
      ] },
    ],
  },
  {
    id: "s9", title: "The Last of Us", overview: "Joel, a survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey.", poster: "p21", genres: ["Action", "Adventure", "Drama"], releaseYear: 2023, director: "Craig Mazin", cast: [{ name: "Pedro Pascal", role: "Joel" }, { name: "Bella Ramsey", role: "Ellie" }], voteAverage: 8.7, popularity: 92.4, mode: "LOCKED", preset: 1, unlockHours: 24,
    seasons: [
      { id: "ss10", no: 1, title: "Season 1", mode: "LOCKED", preset: 1, unlockHours: 24, episodes: [
        { id: "ep18", no: 1, title: "When You're Lost in the Darkness", overview: "Twenty years after a fungal pandemic ravages civilization, Joel and his partner Tess are tasked with a mission.", thumb: "p21", minutes: 81, setting: "OVERRIDE", mode: "FREE" },
        { id: "ep19", no: 2, title: "Infected", overview: "Joel, Tess and Ellie are forced to traverse dangerous territory.", thumb: "p22", minutes: 58, setting: "SEASON" },
      ] },
    ],
  },
];
