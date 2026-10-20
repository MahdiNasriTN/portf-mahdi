// Splits the original single-file page into fonts, scoped CSS, markup and scripts.
import fs from "node:fs";
import postcss from "postcss";
import { applyProfile } from "./profile.mjs";

const src = fs.readFileSync("docs/research/home/source-original.html", "utf8");
const pub = "public/home";
const BASE = "/home/";
fs.mkdirSync(`${pub}/fonts`, { recursive: true });

// style
const css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const fontNames = ["big-shoulders", "melodrama-500", "name-fallback", "melodrama-700"];
let fi = 0;
const cssNoFonts = css.replace(/url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/g, (_, b64) => {
  const f = `fonts/${fontNames[fi++]}.woff2`;
  fs.writeFileSync(`${pub}/${f}`, Buffer.from(b64, "base64"));
  return `url(${BASE}${f})`;
});

const root = postcss.parse(cssNoFonts);
const scope = (sel) => {
  sel = sel.trim();
  if (sel === ":root" || sel === "html,body" || sel === "body") return ".mn";
  if (sel === "html") return ".mn";
  if (sel === "*") return ".mn, .mn *";
  if (sel.startsWith("html.")) return ".mn." + sel.slice(5);
  if (sel === "html,body") return ".mn";
  return ".mn " + sel;
};
root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  rule.selectors = rule.selectors.flatMap((s) => scope(s).split(",").map((x) => x.trim()));
});
// html,body{...} splits into html + body selectors both -> .mn (dedupe)
root.walkRules((rule) => { rule.selectors = [...new Set(rule.selectors)]; });
fs.writeFileSync("src/app/home.css", root.toString());

// markup (body without scripts)
let body = src.match(/<body>([\s\S]*)<\/body>/)[1];
body = body.replace(/<script[\s\S]*?<\/script>/g, "");
body = body
  .replace(/(href|src)="work\//g, `$1="${BASE}work/`)
  .replace(/href="resume\//g, `href="${BASE}resume/`);

// ---- Mahdi Nasri edition: name, role, projects ----
const projects = [
  ["scrabble", "Atelier Scrabble", "Website", "https://scrable.tunibyte.com/", "A calm home for study and art", "Website for private study spaces and artistic workshops, with reservations and a French, Arabic and English interface.", "Atelier Scrabble homepage: a teal hero reading Un espace pour étudier, créer et respirer", "left top"],
  ["aurex", "Aurex", "Brand and e-commerce", "https://aurex.tunibyte.com/", "A footwear brand that moves slowly", "Brand and storefront for a premium sneaker label, built around editorial typography and a product that fills the screen.", "Aurex homepage: the Core One sneaker over oversized serif lettering", "left top"],
  ["modatex", "Modatex", "Point of sale and admin", "https://stock.tunibyte.com/", "Curtains, stock and sales in one place", "Showcase site, point-of-sale and admin management for a Sfax textile maker, with a companion Android app.", "Modatex homepage: curtain photography around the headline Lignes, courbes et mouvement", "left top"],
  ["tedallel", "Tedallel Express", "Delivery platform", "https://application.tedalel.tn/", "Restaurants delivered across Tunisia", "A food delivery platform listing 81 restaurants across Tunis, Sfax and Sousse, with search, accounts and ordering.", "Tedallel Express homepage: Vos repas préférés, livrés chez vous, with a restaurant search", "left top"],
  ["mukeyem", "Mukeyem", "Registration platform", "https://reg.mukeyem.se/", "Summer camp registration, in Swedish", "Registration for the Eritrean summer camp in Sweden: age-based pricing, family discounts and a reserve-spot flow.", "Mukeyem 2026 registration page with the camp price table", "left top"],
  ["comptaflow", "ComptaFlow", "Accounting app", "https://accounting.tunibyte.com/", "Accounting practice, managed", "Web application for an accounting firm to manage clients, bookkeeping and day-to-day work.", "ComptaFlow accounting application", "left top"],
];
const cards = projects.map(([slug, title, kind, url, h, d, alt, pos]) => `
        <a class="proj" href="${url}" target="_blank" rel="noopener">
          <div class="label"><span>${title}</span><em>${kind}</em></div>
          <div class="cover"><img src="${BASE}work/${slug}-cover.jpg" alt="${alt}" loading="lazy" style="object-position:${pos}"></div>
          <h3>${h}</h3>
          <p>${d}</p>
        </a>`).join("\n");
body = body.replace(/(\s*<a class="proj"[\s\S]*?<\/a>)+(?=\s*<\/div>\s*<\/section>)/, cards + "\n      ");
body = body
  .replace(/<div id="awwwards"[\s\S]*?<\/div>\s*$/, "")
  .replace(/<p class="work-more">[\s\S]*?<\/p>/, "")
  .replace(/<a href="https:\/\/www\.linkedin\.com\/in\/[^>]*>LinkedIn<\/a>\s*<a href="https:\/\/www\.behance[^>]*>Behance<\/a>\s*<a href="[^"]*resume[^>]*>Resume<\/a>/, "")
  .replace(/<div class="more" id="more">[\s\S]*?<\/div>/, "")
  .replace(/<div><dt>Now<\/dt>[\s\S]*?<\/dl>/, "<div><dt>Now</dt><dd>Software Engineer</dd></div>\n        </dl>")
  .replaceAll("nesilkunnappally@gmail.com", "mahdi.nasri123@gmail.com")
  .replace("Hi, I'm Nesil.", "Hi, I'm Mahdi.")
  .replace('<span>Nesil</span> <span>Noble</span>', "<span>Mahdi</span> <span>Nasri</span>")
  .replace(">Nesil Noble</span>", ">Mahdi Nasri</span>")
  .replace(">Nesil</b>", ">Mahdi</b>")
  .replace("Product Designer &amp; Art Director", "Software Engineer")
  .replaceAll("Nesil’s", "Mahdi’s").replaceAll("Nesil's", "Mahdi's")
  .replace("I design &amp; build experiences that you wish existed", "I build software that you wish existed");

body = applyProfile(body);
fs.writeFileSync(
  "src/components/home/markup.ts",
  "// Generated from the original page body by scripts/home/build.mjs\nexport const siteMarkup = " + JSON.stringify(body.trim()) + ";\n"
);

// scripts
const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).filter((s) => !s.includes("dataLayer"));
const [lenis, journey, overlay] = scripts;
fs.mkdirSync(`${pub}/vendor`, { recursive: true });
fs.writeFileSync(`${pub}/vendor/lenis.js`, lenis);
const patch = (s) =>
  s
    .replaceAll('"audio/interactive-playground.mp3"', `"${BASE}audio/interactive-playground.mp3"`)
    .replaceAll("document.documentElement.classList", "SITE_ROOT.classList")
    .replaceAll('"Nesil"', '"Mahdi"')
    .replaceAll('"Bengaluru"', '"Sfax"');
fs.writeFileSync(`${pub}/journey.js`, "const SITE_ROOT = document.querySelector('.mn');\n" + patch(journey) + "\n" + patch(overlay));
console.log("ok", fi, "fonts;", scripts.length, "scripts");
