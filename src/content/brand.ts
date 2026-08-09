/**
 * Copy for the Brand page.
 *
 * Covers the parent brand (Great Lakes Sports) and its flagship amateur golf
 * series (GAG). Supplied by the client and reproduced verbatim.
 */

export const brand = {
  story: [
    "The name Great Lakes Sports was inspired by the Great Lakes of North America.",
    "As one of the world's largest freshwater systems, the Great Lakes symbolize openness, vitality, and connection. They have long served as gateways linking communities, economies, and cultures across Canada and the United States.",
    "Inspired by this spirit, Great Lakes Sports was established with a global vision—to connect people through sport and to build meaningful relationships that extend far beyond competition.",
    "Our long-term goal is to develop internationally respected sporting events and create platforms where athletes, organizations, partners, and communities can grow together.",
  ],

  motto: "From the Great Lakes to the Five Continents.",

  /** The flagship amateur golf series. */
  gag: {
    abbreviation: "GAG",
    fullName: "Great Lakes Amateur Golf",
    slogan: "GAG³ — BE PRO!",
    tagline: "Let's Play GAG.",
    farewell: "See You at GAG.",

    /**
     * The official chant, designed as a call-and-response for opening
     * ceremonies, closing ceremonies and prize presentations.
     */
    chant: {
      lines: [
        { voice: "Leader", text: "G — A — G!" },
        { voice: "Everyone", text: "GAG! GAG! GAG!  Let's Play GAG!" },
        { voice: "Women", text: "GAG! GAG! GAG!" },
        { voice: "Men", text: "Let's Play GAG!" },
        { voice: "Men", text: "GAG! GAG! GAG!" },
        { voice: "Women", text: "Let's Play GAG!" },
        { voice: "Everyone", text: "GAG! GAG! GAG!  Let's Play GAG!" },
      ],
      note: "Repeated two or three times, accompanied by drums and lighting.",
    },
  },
} as const;
