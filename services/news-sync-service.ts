import Parser from "rss-parser";
import { blogRepository } from "@/repositories/blog-repository";
import { blogPostRepository } from "@/repositories/blog-post-repository";
import { extract } from "@extractus/article-extractor";

console.log("[SYNC] NewsSyncService module loading...");

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

export class NewsSyncService {
  async sync() {
    console.log("============== [INICIO SYNC] ==============");
    try {
      console.log("[SYNC] Buscando blogs no banco de dados...");
      const blogs = await blogRepository.getAll();
      console.log(`[SYNC] OK: ${blogs.length} blogs encontrados.`);

      for (const blog of blogs) {
        console.info(`[SYNC] > Blog: ${blog.nome} (ID: ${blog.id})`);
        try {
          const feed = await parser.parseURL(blog.rssUrl);
          const items = feed.items || [];
          console.info(`[SYNC]   - RSS OK: ${items.length} itens`);

          let countNew = 0;
          for (const item of items) {
            if (!item.link || !item.title) continue;

            try {
              const startExists = Date.now();
              const exists = await blogPostRepository.existsByUrl(item.link);
              
              if (exists) continue;

              countNew++;
              console.log(`[SYNC]   + NOVO: ${item.title.substring(0, 40)}...`);

              let imageUrl = this.extractImageUrlFromRSS(item);
              let titulo = item.title;

              const needsExtraction = !imageUrl || (titulo && titulo.length < 50);

              if (needsExtraction) {
                try {
                  const article = await extract(item.link);
                  if (article) {
                    if (!imageUrl && article.image) imageUrl = article.image;
                    if (article.title && article.title.length > titulo.length) {
                      titulo = article.title;
                    }
                  }
                } catch (e) {
                  console.warn(`[SYNC]     ! Erro extração: ${item.link}`);
                }
              }

              const publishDate = item.pubDate ? new Date(item.pubDate) : new Date();

              await blogPostRepository.upsert({
                where: { url: item.link },
                update: { titulo, imageUrl, dataPublicacao: publishDate },
                create: {
                  titulo,
                  url: item.link,
                  imageUrl,
                  dataPublicacao: publishDate,
                  blogId: blog.id,
                },
              });
            } catch (itemError) {
              console.error(`[SYNC]     !!! ERRO NO ITEM ${item.link}:`, itemError);
            }
          }
          console.log(`[SYNC] > Sucesso: ${blog.nome} (+${countNew} novos)`);
        } catch (blogError) {
          console.error(`[SYNC] !!! ERRO NO BLOG ${blog.nome}:`, blogError);
        }
      }
    } catch (globalError) {
      console.error("[SYNC] !!! ERRO GLOBAL NO SYNC:", globalError);
    }
    console.log("============== [FIM SYNC] ==============");
  }

  private extractImageUrlFromRSS(item: any): string | null {
    if (item.enclosure && item.enclosure.url) {
      return item.enclosure.url;
    } else if (item.mediaContent && item.mediaContent[0] && item.mediaContent[0].$) {
      return item.mediaContent[0].$.url;
    } else if (item.contentEncoded) {
      const imgMatch = item.contentEncoded.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) return imgMatch[1];
    }
    return null;
  }
}

export const newsSyncService = new NewsSyncService();
