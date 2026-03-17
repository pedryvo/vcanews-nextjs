import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ 
  url: "prisma/dev.db" 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const vca = await prisma.cidade.upsert({
    where: { nome: "Vitória da Conquista" },
    update: {},
    create: { nome: "Vitória da Conquista" },
  });

  const blogs = [
    {
      nome: "Blog do Anderson",
      rssUrl: "https://www.blogdoanderson.com/feed/",
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { rssUrl: blog.rssUrl },
      update: { nome: blog.nome },
      create: {
        nome: blog.nome,
        rssUrl: blog.rssUrl,
        cidadeId: vca.id,
      },
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
