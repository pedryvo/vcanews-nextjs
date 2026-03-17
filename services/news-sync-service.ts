import Parser from "rss-parser";
import { blogRepository } from "@/repositories/blog-repository";
import { blogPostRepository } from "@/repositories/blog-post-repository";
import { extract } from "@extractus/article-extractor";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

export class NewsSyncService {
  async sync() {
    console.info("============== [START SYNC] ==============");
    try {
      const blogs = await blogRepository.getAll();
      console.info(`[SYNC] Blogs para processar: ${blogs.length}`);

      for (const blog of blogs) {
        console.info(`[SYNC] > Iniciando Blog: ${blog.nome}`);
        try {
          const feed = await parser.parseURL(blog.rssUrl);
          console.info(`[SYNC] RSS OK: ${feed.items?.length || 0} items encontrados`);

          let countNew = 0;
          for (const item of feed.items) {
            if (!item.link || !item.title) continue;

            const exists = await blogPostRepository.existsByUrl(item.link);
            if (exists) continue;

            countNew++;
            console.info(`[SYNC]   + Novo post: ${item.title.substring(0, 50)}...`);

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
                console.warn(`[SYNC]   ! Erro extração extra (${item.link})`);
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
          }
          console.info(`[SYNC] > Finalizado Blog: ${blog.nome} (${countNew} novos)`);
        } catch (blogError) {
          console.error(`[SYNC] !!! ERRO NO BLOG ${blog.nome}:`, blogError);
        }
      }
    } catch (globalError) {
      console.error("[SYNC] !!! ERRO GLOBAL NO SYNC:", globalError);
    }
    console.info("============== [END SYNC] ==============");
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
