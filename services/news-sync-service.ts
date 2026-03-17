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
        console.info(`[SYNC] > Blog: ${blog.nome} (ID: ${blog.id})`);
        try {
          const feed = await parser.parseURL(blog.rssUrl);
          const items = feed.items || [];
          console.info(`[SYNC]   - RSS OK: ${items.length} itens`);

          let countNew = 0;
          for (const item of items) {
            if (!item.link || !item.title) continue;

            // Log de início de processamento do item
            // console.info(`[SYNC]   - Verificando: ${item.title.substring(0, 30)}...`);
            
            try {
              const startExists = Date.now();
              const exists = await blogPostRepository.existsByUrl(item.link);
              // console.info(`[SYNC]     - Exists check: ${Date.now() - startExists}ms`);
              
              if (exists) continue;

              countNew++;
              console.info(`[SYNC]   + NOVO: ${item.title.substring(0, 40)}...`);

              let imageUrl = this.extractImageUrlFromRSS(item);
              let titulo = item.title;

              const needsExtraction = !imageUrl || (titulo && titulo.length < 50);

              if (needsExtraction) {
                try {
                  // Adicionando um timeout manual para a extração ou apenas logando
                  // console.info(`[SYNC]     - Extraindo metadados extras...`);
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

              const startUpsert = Date.now();
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
              // console.info(`[SYNC]     - Upsert OK: ${Date.now() - startUpsert}ms`);
            } catch (itemError) {
              console.error(`[SYNC]     !!! ERRO NO ITEM ${item.link}:`, itemError);
            }
          }
          console.info(`[SYNC] > Sucesso: ${blog.nome} (+${countNew} novos)`);
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
