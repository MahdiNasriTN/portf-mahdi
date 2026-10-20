// Mahdi Nasri's own copy, replacing the original page's biography.
export function applyProfile(html) {
  let body = html;
  const must = (from, to) => {
    const ok = typeof from === "string" ? body.includes(from) : from.test(body);
    if (!ok) throw new Error("profile patch did not match: " + from);
    body = body.replace(from, () => to);
  };
  must('aria-label="Designing experiences"><span aria-hidden="true">Designing</span><span aria-hidden="true">Experiences</span>', 'aria-label="Building products"><span aria-hidden="true">Building</span><span aria-hidden="true">Products</span>');
  must(/7\+ years designing digital experiences[^<]*/, "Full Stack Developer at ZETABOX in Sfax, building cross-platform mobile and web applications with Flutter and React, and studying for an Engineer’s degree in Software Engineering.");
  must(/Tokens become components\.[^<]*/, "Flutter and React up front, Strapi and PostgreSQL behind, REST APIs in between: structured data, secure and scalable.");
  must('<span class="btn">Continue learning</span>', '<span class="btn">Get started</span>');
  must("<h2 class=\"bl-years\">7+ years.</h2>", '<h2 class="bl-years">2+ years.</h2>');
  must("Still curious. Still making.", "Still curious. Still shipping.");
  must("I build products and the teams that build products.", "I build products from first commit to production.");
  must(/From the first blank Figma frame[^<]*/, "Mobile and web apps in Flutter and React, backends in Strapi and PostgreSQL, REST APIs between them. I’ve led a product from idea to launch: Takwira, a football reservation platform with real-time messaging and tools for field owners.");
  must("My obsession lives in the gap between usable and unforgettable.", "I work the way good teams work.");
  must(/I believe great design should solve[^<]*/, "Agile Scrum, Jira for planning, Jenkins for CI/CD, regular sprint reviews. Features that ship on time, stay maintainable, and are easy for the next person to pick up.");
  must("I design for inclusion.", "I build for the person using it.");
  must(/Not because it's on a checklist[^<]*/, "State that behaves, APIs that answer quickly, interfaces that stay accessible: the small engineering choices people feel without noticing.");
  must("These days I'm also in the code.", "These days I'm also building with AI.");
  must(/Prototyping faster, helping designers[^<]*/, "Designing AI systems with Claude and the Claude Agent SDK, and certified as a Claude Certified Architect (Foundations) by Anthropic.");
  must("I'd rather be standing there when it decides.", "Every night is a step.");
  must("I don't believe in polite decks that protect average ideas.", "Every line is a decision.");
  must(/I don't believe in <span class="vanilla">vanilla/, 'Every <span class="vanilla">bug');
  must(/(<\/span>)\.(<\/p>\s*<p class="c3">)/, "$1 is a battle.$2".replace(/\$(\d)/g, ""));
  must(/I believe in things with a spine[^<]*/, "03:47 AM. The terminal doesn’t sleep. Late nights, builds that fail five times before they pass, and the quiet satisfaction when an idea finally becomes a real product.");
  must("That's what I make.<br>That's what I lead.", "That's what I build.<br>That's what I ship.");
  must(/I'm open to building brands, designing experiences and good conversations over a cup of /, "I'm open to full-stack roles, freelance projects and good conversations over a cup of ");
  must('<span>Based in</span><span>Bengaluru.</span>', "<span>Based in</span><span>Sfax.</span>");
  must(/Kerala at heart, Bengaluru by address\.[^<]*/, "Sfax, Tunisia. Building software for clients in Tunisia and Sweden, and teaching what I’ve learned along the way.");
  must(">KA 01<", ">SFAX<");
  must("<span><i>I care about the details</i></span>", "<span><i>I care about the code</i></span>");
  must("<span><i>that make a product</i></span>", "<span><i>that makes a product</i></span>");
  must("<span><i>feel like itself.</i></span>", "<span><i>feel effortless.</i></span>");
  must(/The flows, the edge cases, the tiny interactions[^<]*/, "Clean APIs, structured data, state that behaves, the edge cases nobody asked about. I like getting into the weeds, because that’s where an app becomes reliable.");
  must(/<dl class="facts" id="facts">[\s\S]*?<\/dl>/, '<dl class="facts" id="facts">\n          <div><dt>Now</dt><dd>Full Stack Developer, ZETABOX</dd></div>\n          <div><dt>Studying</dt><dd>Engineer’s degree in Software Engineering, IIT</dd></div>\n          <div><dt>Stack</dt><dd>Flutter, React, Strapi.js, PostgreSQL, Agile Scrum</dd></div>\n        </dl>');
  must(/<div class="tools" id="tools"[^>]*>[\s\S]*?<\/div>/, '<div class="tools" id="tools" aria-label="Tools">' + ["Flutter", "React", "Strapi.js", "PostgreSQL", "Riverpod", "Node.js", "Express", "MongoDB", "GSAP", "REST APIs", "Jira", "Jenkins", "GitLab", "Claude"].map((t) => `<span>${t}</span>`).join("") + "</div>");
  return body;
}
