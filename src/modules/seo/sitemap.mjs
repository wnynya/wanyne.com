const root = `https://wanyne.com`;

async function gen() {
  let xml = ``;
  xml += `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  xml += url(`${root}`, null, 1.0);
  xml += url(`${root}/a`, null, 0.9);
  xml += url(`${root}/network-crystal`, null, 0.8);
  xml += url(`${root}/b/index?page=1`, null, 0.8);

  /*const articles = await BlogArticle.index({}, 1000000, 1, false, true);
  for (const article of articles) {
    xml += url(
      `${root}/b/` + article.eid,
      article.modified == 0 ? article.creation : article.modified,
      0.7
    );
  }*/

  xml += `</urlset>`;

  return xml;
}
export default gen;

function url(loc, mod, pri = 0.5, freq = 0) {
  var freqs = [`always`, `hourly`, `daily`, `weekly`, `monthly`];

  var xml = ``;
  xml += `<url>`;
  // loc
  xml += `  <loc>` + loc + `</loc>`;
  // lastmod
  if (mod == `now`) {
    mod = new Date().toJSON().substring(0, 10);
    xml += `  <lastmod>${mod}</lastmod>`;
  } else if (mod == null) {
    xml += ``;
  } else {
    mod = new Date(mod).toJSON().substring(0, 10);
    xml += `  <lastmod>${mod}</lastmod>`;
  }
  // changefreq
  xml += `  <changefreq>` + freqs[freq] + `</changefreq>`;
  // priority
  xml += `  <priority>` + pri + `</priority>`;

  xml += `</url>`;
  return xml;
}
