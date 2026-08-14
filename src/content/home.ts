/**
 * Copy for the home page.
 *
 * English is taken from the client's Copy Deck V1.0. The three section
 * teasers below deliberately restate the leading line of the page they point
 * at, so the home page reads as a map of the site rather than as separate
 * marketing copy that then has to be kept in sync.
 */

import type { Lang } from "../i18n/config";

type HomeContent = {
  /** The paragraph under "GAG is more than a golf tournament." */
  positioning: string;
  /**
   * The four things GAG exists to give players, drawn from the Vision copy:
   * "more opportunities to play, compete, connect and grow".
   *
   * This replaced the 16–25 age ladder that the Copy Deck places on the home
   * page. On the Players page those bands read as who the platform is for;
   * rendered large on the landing page they read as an entry requirement,
   * and the first tournament is open well beyond them. The ladder still
   * appears on /players, in the context that explains it.
   */
  pillars: string[];
  teasers: {
    /** Route this section points at. */
    route: string;
    /** Heading key is supplied by the page; this is the standing line. */
    line: string;
    body: string;
  }[];
};

export const home: Record<Lang, HomeContent> = {
  en: {
    positioning:
      "GAG is a youth-focused amateur golf platform connecting young golfers, universities, tournaments and opportunities across Canada and around the world.",
    pillars: ["Play", "Compete", "Connect", "Grow"],
    teasers: [
      {
        route: "/players",
        line: "Meet the next generation.",
        body: "Junior, university and elite amateur golfers, and the step each of them is trying to take next.",
      },
      {
        route: "/university",
        line: "Connecting universities through golf.",
        body: "University golf is the bridge between junior golf and the next level of competition. We are building the network that carries players across it.",
      },
      {
        route: "/community",
        line: "One game. One community. A world of opportunities.",
        body: "Players, coaches, universities, clubs, partners, sponsors and golf organizations — GAG is built by all of them.",
      },
    ],
  },

  fr: {
    positioning:
      "GAG est une plateforme de golf amateur dédiée à la relève, qui relie jeunes golfeurs, universités, tournois et occasions de développement au Canada et dans le monde.",
    pillars: ["Jouer", "Rivaliser", "Se connecter", "Progresser"],
    teasers: [
      {
        route: "/players",
        line: "Voici la relève.",
        body: "Golfeurs juniors, universitaires et amateurs d'élite, et l'étape que chacun cherche à franchir.",
      },
      {
        route: "/university",
        line: "Relier les universités par le golf.",
        body: "Le golf universitaire est le pont entre le golf junior et la compétition de haut niveau. Nous bâtissons le réseau qui permet aux joueurs de le franchir.",
      },
      {
        route: "/community",
        line: "One Game. One Community. A World of Opportunities.",
        body: "Joueurs, entraîneurs, universités, clubs, partenaires, commanditaires et organisations de golf — GAG se construit avec eux tous.",
      },
    ],
  },
};
