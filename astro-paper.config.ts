import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://nworm.icu",
    title: "Nworm",
    description: "一条咸鱼",
    author: "Nworm",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 5,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/1574242600/blog-data/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/1574242600" },
    { name: "telegram", url: "https://t.me/nworm1574" },
    { name: "mail", url: "mailto:admin@nworm.icu" },
  ],
  shareLinks: [],
});
