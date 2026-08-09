/**
 * Copy for the About page.
 *
 * Supplied by the client and reproduced verbatim. Kept apart from the page
 * template so that editing a sentence never means editing markup — and so a
 * visual editor can be pointed at these fields later without the page having
 * to be rebuilt around it.
 */

export const about = {
  intro: [
    "Great Lakes Sports Inc. is a Canadian sports organization headquartered in Toronto, Ontario.",
    "Founded with a long-term vision, the company is committed to developing world-class sporting events, building international partnerships, and creating sustainable platforms that connect athletes, organizations, businesses, and communities through sport.",
    "Inspired by North America's Great Lakes, our name represents openness, diversity, and connection. Our mission extends beyond organizing competitions—we aim to create opportunities for international collaboration and promote excellence in amateur sports.",
  ],

  vision: "Connecting the Great Lakes to the World.",

  mission:
    "To build internationally recognized amateur sporting events and foster meaningful global partnerships through professionalism, integrity, and innovation.",

  /**
   * The client supplied these as names only. They are presented as a set of
   * five statements rather than padded out with invented explanations; if
   * one-line definitions are provided later, they slot in here.
   */
  coreValues: [
    "Excellence",
    "Integrity",
    "Collaboration",
    "Innovation",
    "Long-term Commitment",
  ],

  closing:
    "Great Lakes Sports believes that sport has the power to inspire people, connect cultures, and create lasting value for society.",

  chairman: {
    name: "Wu Zeming",
    title: "Chairman",
    organization: "Great Lakes Sports Inc.",
    paragraphs: [
      "Welcome to Great Lakes Sports Inc.",
      "Sport is more than competition—it is a universal language that brings people together.",
      "Great Lakes Sports was founded with a simple but ambitious vision: to build meaningful international platforms where sport creates opportunities for excellence, friendship, and long-term collaboration.",
      "We believe that outstanding sporting events should not only showcase athletic performance but also connect talented individuals, respected organizations, forward-thinking businesses, and communities from around the world.",
      "As we continue to grow, we remain committed to professionalism, integrity, and long-term development.",
      "Thank you for visiting our website. We look forward to building the future of sport together.",
    ],
  },
} as const;
