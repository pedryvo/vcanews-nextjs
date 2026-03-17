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
    const blogs = await blogRepository.getAll();

    for (const blog of blogs) {
      try {
        console.log(`Buscando notícias de: ${blog.nome} (${blog.rssUrl})`);
        const feed = await parser.parseURL(blog.rssUrl);

        for (const item of feed.items) {
          if (!item.link || !item.title) continue;

          // OTIMIZAÇÃO: Se já existe, pula o processamento pesado
          const exists = await blogPostRepository.existsByUrl(item.link);
          if (exists) {
            // console.log(`Post já existe, pulando: ${item.title}`);
            continue;
          }

          let imageUrl = this.extractImageUrlFromRSS(item);
          let titulo = item.title;

          // Se não encontrou imagem no RSS, tenta extrair da página do post
          // Ou se o título parecer truncado/incompleto (opcional, mas o usuário pediu título completo)
          try {
            const article = await extract(item.link);
            if (article) {
              if (!imageUrl && article.image) {
                console.log(`Imagem extraída via article-extractor para: ${item.title}`);
                imageUrl = article.image;
              }
              if (article.title && article.title.length > titulo.length) {
                console.log(`Título aprimorado: ${article.title}`);
                titulo = article.title;
              }
            }
          } catch (e) {
            console.error(`Erro ao extrair metadados extras de ${item.link}:`, e);
          }

          const publishDate = item.pubDate ? new Date(item.pubDate) : new Date();

          await blogPostRepository.upsert({
            where: { url: item.link },
            update: {
              titulo: titulo,
              imageUrl: imageUrl,
              dataPublicacao: publishDate,
            },
            create: {
              titulo: titulo,
              url: item.link,
              imageUrl: imageUrl,
              dataPublicacao: publishDate,
              blogId: blog.id,
            },
          });
        }
      } catch (error) {
        console.error(`Erro ao processar blog ${blog.nome}:`, error);
      }
    }
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
