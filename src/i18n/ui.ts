/**
 * Interface strings — navigation, section headings, buttons, and the standing
 * copy that frames the client's content.
 *
 * Long-form copy lives in src/content/. This file holds only the chrome, so
 * that adding a language means translating a short, bounded list rather than
 * hunting through templates.
 *
 * ⚠️ The Chinese strings are a working translation and should be reviewed by
 * the client, who is a native speaker and owns the brand's voice.
 */

import type { Lang } from "./config";

export const ui = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.brand": "Brand",

    "page.home": "Home",
    "page.about": "About Us",
    "page.brand": "Our Brand",

    "meta.description":
      "Great Lakes Sports Inc. is a Canadian sports organization headquartered in Toronto, Ontario, developing world-class amateur sporting events and international partnerships.",

    "home.flagship": "Our Flagship Series",
    "home.upcoming": "Upcoming",
    "home.upcoming.empty":
      "The schedule for the coming season will be announced shortly.",
    "home.partnership": "Partnership",

    "about.vision": "Our Vision",
    "about.mission": "Our Mission",
    "about.values": "Our Core Values",
    "about.chairman": "Chairman's Message",
    "about.chairmanTitle": "Chairman",

    "brand.story": "Brand Story",
    "brand.motto": "Our Motto",
    "brand.applications": "Brand Applications",
    "brand.applicationsNote":
      "Concept visuals for tournament trophies, player gifts and event merchandise, developed alongside the identity.",

    "cta.about": "About Us",
    "cta.brand": "Explore the Brand",
    "cta.enquire": "Enquire",
    "cta.enquirePending": "Enquiry details to follow",

    "a11y.skip": "Skip to content",
    "a11y.mainNav": "Main navigation",
    "a11y.footerNav": "Footer navigation",
    "a11y.language": "Language",
  },

  zh: {
    "nav.home": "首页",
    "nav.about": "关于我们",
    "nav.brand": "品牌",

    "page.home": "首页",
    "page.about": "关于我们",
    "page.brand": "品牌",

    "meta.description":
      "Great Lakes Sports Inc. 是一家总部位于加拿大安大略省多伦多的体育机构，致力于打造世界一流的业余体育赛事与国际合作伙伴关系。",

    "home.flagship": "旗舰赛事",
    "home.upcoming": "近期赛事",
    "home.upcoming.empty": "新赛季赛程即将公布。",
    "home.partnership": "合作与赞助",

    "about.vision": "我们的愿景",
    "about.mission": "我们的使命",
    "about.values": "核心价值观",
    "about.chairman": "董事长致辞",
    "about.chairmanTitle": "董事长",

    "brand.story": "品牌故事",
    "brand.motto": "品牌箴言",
    "brand.applications": "品牌应用",
    "brand.applicationsNote":
      "赛事奖杯、球员礼品与活动周边的概念效果图，与品牌识别同步设计。",

    "cta.about": "了解我们",
    "cta.brand": "了解品牌",
    "cta.enquire": "联系我们",
    "cta.enquirePending": "联系方式即将公布",

    "a11y.skip": "跳至主要内容",
    "a11y.mainNav": "主导航",
    "a11y.footerNav": "页脚导航",
    "a11y.language": "语言",
  },
} as const;

export type UIKey = keyof (typeof ui)["en"];

/**
 * Returns a lookup function bound to one language.
 *
 * Keys are typed against the English table, so a key that exists in one
 * language but not the other is a build error rather than a blank space on
 * the page.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key];
  };
}
