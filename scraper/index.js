const puppeteer = require("puppeteer");

const contentCache = {};

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.nhl.com/avalanche/news/");

  const content = await page.evaluate(() => {
    const articles = [];
    const news = document.querySelector(".template--article__content");

    news.querySelectorAll(".article-item").forEach(async (article) => {
      articles.push({
        headline: article
          .querySelector(".article-item__top")
          .querySelector(".article-item__headline").innerHTML,
        subHeader: article
          .querySelector(".article-item__top")
          .querySelector(".article-item__subheader").innerHTML,
        imgSrc: article
          .querySelector(".article-item__img-container")
          .querySelector("img")
          .getAttribute("data-src"),
        preview: article
          .querySelector(".article-item__bottom")
          .querySelector(".article-item__preview").innerHTML,
        bodyId: article.getAttribute("data-contentid"),
      });
    });

    return articles;
  });

  const getBody = async (id) => {
    try {
      await page.goto(`https://www.nhl.com/avalanche/news/article-body/${id}`);
      const data = await page.evaluate(
        () => document.querySelector("#body").innerHTML
      );
      return data;
    } catch (e) {
      console.log(
        "Failed",
        `https://www.nhl.com/avalanche/news/article-body/${id}`
      );
      return "";
    }
  };

  for (let i = 0; i < content.length; i++) {
    if (content[i].bodyId) {
      const body = await getBody(content[i].bodyId);
      content[i].body = body;
    }
  }

  console.log('Content added', new Date().toISOString())
  contentCache.data = content;
};

module.exports = { startScrape: scrape, contentCache };
