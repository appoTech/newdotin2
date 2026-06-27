export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const ua = req.headers.get("user-agent") || "";
  const isBot =
    /(facebookexternalhit|facebot|WhatsApp|whatsapp|twitterbot|xbot|telegrambot|slackbot|discordbot|pinterest|preview|linkedinbot|skypeuripreview)/i.test(
      ua
    );

  if (!isBot) {
    // Real user → short-circuit edge back to React
    return new Response(null, { status: 404 });
  }

  const url = new URL(req.url);
  const slug = url.pathname.split("/").pop();

  //No slug → no preview
  if (!slug || slug.trim() === "") {
    return new Response(null, { status: 404 });
  }

  // const thumbnail = `https://img.youtube.com/vi/${slug}/hqdefault.jpg`;
  const data = await fetch(
    `https://appopener-backend-1klr.onrender.com/yt/preview/${slug}`
  );
  if (!data.ok) {
    return new Response(null, { status: 404 });
  }
  let { title, description, thumbnail } = await data.json();
  title = title || "🔥 AppOpener.com";
  description = description || "Watch it directly in Youtube App!";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${thumbnail}" />
        <meta property="og:url" content="${req.url}" />
        <meta property="og:type" content="video.other" />
      </head>
      <body>OG Preview for bots only</body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
}
