/**
 * Copy for the About page.
 *
 * English is taken from the client's Copy Deck V1.0 and reproduced verbatim.
 *
 * ⚠️ The French is a working translation using Canadian conventions. Have it
 * reviewed by a francophone before the site is promoted in French.
 */

import type { Lang } from "../i18n/config";

type Principle = { title: string; body: string };

type AboutContent = {
  who: string[];
  /** Three short lines that close the "who we are" section. */
  whoClosing: string[];
  vision: { line: string; body: string[]; closing: string };
  mission: { line: string; intro: string; pillars: Principle[] };
  story: { line: string; body: string[]; stance: string[]; closing: string };
  values: { pillars: Principle[]; closing: string };
  governance: { line: string; intro: string; principles: Principle[]; closing: string };
  fund: { line: string; intro: string[]; areas: string[]; closing: string };
};

export const about: Record<Lang, AboutContent> = {
  en: {
    who: [
      "GAG is a youth-focused amateur golf platform built for the next generation of golfers.",
      "Based in the Great Lakes region of Canada, GAG is dedicated to connecting young golfers, universities, coaches, golf clubs, sponsors and golf organizations through high-level amateur competition, player development and international exchange.",
      "Our focus is on young golfers aged 16–25, particularly those moving from junior and university golf toward elite amateur and professional golf.",
      "GAG is not simply about organizing tournaments. We are building a platform where young golfers can compete at a higher level, challenge themselves against stronger opponents, connect with universities and the wider golf community, and discover new opportunities to take their game further.",
    ],
    whoClosing: ["GAG is a platform.", "GAG is a community.", "GAG is a pathway."],

    vision: {
      line: "Rooted in the Great Lakes. Connected to the World.",
      body: [
        "The Great Lakes are where GAG begins. From this region, GAG aims to build connections between young golfers in Canada and the rest of the world.",
        "We want young golfers to have more opportunities to play, compete, connect and grow.",
      ],
      closing: "Dream big. Play GAG.",
    },

    mission: {
      line: "Building a Better Platform for Young Golfers.",
      intro:
        "GAG's mission is to create a professional, competitive and inclusive platform for the next generation of golfers.",
      pillars: [
        {
          title: "Build Great Competition",
          body: "We organize high-level amateur golf competitions with professional standards, clear rules and rigorous tournament operations.",
        },
        {
          title: "Develop Young Golfers",
          body: "We support young golfers as they progress from junior and university golf toward elite amateur and professional competition.",
        },
        {
          title: "Connect Universities & Golf",
          body: "We connect universities, golf teams, players, coaches, clubs and organizations to create more opportunities for young golfers.",
        },
        {
          title: "Connect Golfers to the World",
          body: "We bring together young golfers from Canada and around the world through tournaments, university events and international exchange.",
        },
      ],
    },

    story: {
      line: "It Started With a Simple Idea.",
      body: [
        "Golf is a global sport. But for many young golfers, the path from junior and university golf to higher-level competition is not always clear.",
        "Young golfers need opportunities to compete. They need stronger competition. They need professional tournaments. They need connections with universities, coaches and other players. And they need a platform that can connect them to the wider world of golf.",
        "GAG was created with this idea in mind. We believe young golfers deserve a platform that is different from a traditional golf association and different from a purely commercial tournament.",
      ],
      stance: [
        "Young, but never casual.",
        "Professional, but never old-fashioned.",
        "International, while remaining rooted in the Great Lakes.",
      ],
      closing:
        "We are starting in the Great Lakes. Our ambition is to build, step by step, a tournament system, player community and development platform for the next generation of golfers.",
    },

    values: {
      pillars: [
        {
          title: "Youthful",
          body: "We believe in the energy, ambition, creativity and competitive spirit of young people. GAG should feel like their platform — a place where young golfers want to compete, connect and grow.",
        },
        {
          title: "Professional",
          body: "We want GAG to be the most professional platform in amateur golf. From tournament operations and player services to competition rules, scoring and communications, every detail matters.",
        },
        {
          title: "Precise",
          body: "Golf is built on rules, fairness and integrity. We respect the rules. We respect the competition. We respect the players. And we respect every result.",
        },
      ],
      closing: "Young in Spirit. Professional in Competition. Serious in Standards.",
    },

    governance: {
      line: "Professional. Fair. Transparent.",
      intro: "GAG believes that great competition requires great standards.",
      principles: [
        {
          title: "Fair Play",
          body: "Every player deserves a fair opportunity to compete.",
        },
        {
          title: "Rules & Standards",
          body: "Competition must be governed by clear and consistent standards.",
        },
        {
          title: "Integrity",
          body: "We respect the traditions and values of the game.",
        },
        {
          title: "Transparency",
          body: "Important competition information should be clear and accessible.",
        },
        {
          title: "Accountability",
          body: "We take responsibility for our decisions, our competitions and our commitments.",
        },
      ],
      closing: "Great competition starts with great standards.",
    },

    fund: {
      line: "Investing in the Next Generation.",
      intro: [
        "Talent should not be limited by opportunity.",
        "The GAG Youth Golf Fund is designed to support young golfers and the development of youth golf.",
      ],
      areas: [
        "Player Competition",
        "International Exchange",
        "University Golf",
        "Youth Golf Development",
        "Player Development",
      ],
      closing: "Give young golfers a chance to go further.",
    },
  },

  fr: {
    who: [
      "GAG est une plateforme de golf amateur dédiée à la relève, conçue pour la prochaine génération de golfeurs.",
      "Établie dans la région des Grands Lacs au Canada, GAG relie jeunes golfeurs, universités, entraîneurs, clubs de golf, commanditaires et organisations de golf par la compétition amateur de haut niveau, le développement des joueurs et les échanges internationaux.",
      "Nous nous adressons aux golfeurs de 16 à 25 ans, en particulier à ceux qui passent du golf junior et universitaire vers le golf amateur d'élite et professionnel.",
      "GAG ne se limite pas à organiser des tournois. Nous bâtissons une plateforme où les jeunes golfeurs peuvent rivaliser à un niveau supérieur, se mesurer à des adversaires plus forts, tisser des liens avec les universités et le milieu du golf, et découvrir de nouvelles occasions de faire progresser leur jeu.",
    ],
    whoClosing: [
      "GAG est une plateforme.",
      "GAG est une communauté.",
      "GAG est un parcours.",
    ],

    vision: {
      line: "Rooted in the Great Lakes. Connected to the World.",
      body: [
        "Les Grands Lacs sont le point de départ de GAG. À partir de cette région, GAG veut créer des liens entre les jeunes golfeurs du Canada et ceux du reste du monde.",
        "Nous voulons que les jeunes golfeurs aient plus d'occasions de jouer, de rivaliser, de se connecter et de progresser.",
      ],
      closing: "Dream big. Play GAG.",
    },

    mission: {
      line: "Bâtir une meilleure plateforme pour les jeunes golfeurs.",
      intro:
        "La mission de GAG est de créer une plateforme professionnelle, compétitive et inclusive pour la prochaine génération de golfeurs.",
      pillars: [
        {
          title: "Créer de grandes compétitions",
          body: "Nous organisons des compétitions de golf amateur de haut niveau selon des normes professionnelles, des règles claires et une gestion rigoureuse des tournois.",
        },
        {
          title: "Développer les jeunes golfeurs",
          body: "Nous accompagnons les jeunes golfeurs dans leur progression du golf junior et universitaire vers la compétition amateur d'élite et professionnelle.",
        },
        {
          title: "Relier universités et golf",
          body: "Nous relions universités, équipes, joueurs, entraîneurs, clubs et organisations afin de multiplier les occasions offertes aux jeunes golfeurs.",
        },
        {
          title: "Relier les golfeurs au monde",
          body: "Nous rassemblons de jeunes golfeurs du Canada et du monde entier par les tournois, les épreuves universitaires et les échanges internationaux.",
        },
      ],
    },

    story: {
      line: "Tout est parti d'une idée simple.",
      body: [
        "Le golf est un sport mondial. Pourtant, pour bien des jeunes golfeurs, le chemin du golf junior et universitaire vers la compétition de haut niveau n'est pas toujours clair.",
        "Les jeunes golfeurs ont besoin d'occasions de rivaliser. Ils ont besoin d'une compétition plus relevée. Ils ont besoin de tournois professionnels. Ils ont besoin de liens avec les universités, les entraîneurs et les autres joueurs. Et ils ont besoin d'une plateforme qui les relie à l'univers du golf.",
        "GAG est né de cette idée. Nous croyons que les jeunes golfeurs méritent une plateforme différente d'une association de golf traditionnelle comme d'un tournoi purement commercial.",
      ],
      stance: [
        "Jeune, mais jamais désinvolte.",
        "Professionnel, mais jamais démodé.",
        "International, tout en restant ancré dans les Grands Lacs.",
      ],
      closing:
        "Nous commençons dans les Grands Lacs. Notre ambition est de bâtir, étape par étape, un système de tournois, une communauté de joueurs et une plateforme de développement pour la prochaine génération de golfeurs.",
    },

    values: {
      pillars: [
        {
          title: "Jeune",
          body: "Nous croyons à l'énergie, à l'ambition, à la créativité et à l'esprit de compétition des jeunes. GAG doit être leur plateforme — un lieu où les jeunes golfeurs ont envie de rivaliser, de se connecter et de progresser.",
        },
        {
          title: "Professionnel",
          body: "Nous voulons faire de GAG la plateforme la plus professionnelle du golf amateur. De la gestion des tournois aux services aux joueurs, en passant par les règles, le pointage et les communications, chaque détail compte.",
        },
        {
          title: "Rigoureux",
          body: "Le golf repose sur les règles, l'équité et l'intégrité. Nous respectons les règles. Nous respectons la compétition. Nous respectons les joueurs. Et nous respectons chaque résultat.",
        },
      ],
      closing: "Young in Spirit. Professional in Competition. Serious in Standards.",
    },

    governance: {
      line: "Professionnelle. Équitable. Transparente.",
      intro:
        "GAG est convaincue qu'une grande compétition exige de grandes normes.",
      principles: [
        {
          title: "Franc-jeu",
          body: "Chaque joueur mérite une chance équitable de rivaliser.",
        },
        {
          title: "Règles et normes",
          body: "La compétition doit être encadrée par des normes claires et constantes.",
        },
        {
          title: "Intégrité",
          body: "Nous respectons les traditions et les valeurs du jeu.",
        },
        {
          title: "Transparence",
          body: "L'information importante sur la compétition doit être claire et accessible.",
        },
        {
          title: "Responsabilité",
          body: "Nous assumons nos décisions, nos compétitions et nos engagements.",
        },
      ],
      closing: "Une grande compétition commence par de grandes normes.",
    },

    fund: {
      line: "Investir dans la relève.",
      intro: [
        "Le talent ne devrait pas être limité par le manque d'occasions.",
        "Le Fonds GAG pour la relève vise à soutenir les jeunes golfeurs et le développement du golf chez les jeunes.",
      ],
      areas: [
        "Compétition des joueurs",
        "Échanges internationaux",
        "Golf universitaire",
        "Développement du golf chez les jeunes",
        "Développement des joueurs",
      ],
      closing: "Donnons aux jeunes golfeurs la chance d'aller plus loin.",
    },
  },
};
