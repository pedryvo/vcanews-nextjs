import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.NEON_DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Criar Usuários de Desenvolvimento
  console.log("Criando usuários dev...");
  await prisma.user.upsert({
    where: { id: "dev-user" },
    update: {
      name: "Dev Admin (1)",
      email: "dev@vcanews.com",
      role: "ADMIN",
      username: "devadmin",
    },
    create: {
      id: "dev-user",
      name: "Dev Admin (1)",
      email: "dev@vcanews.com",
      role: "ADMIN",
      username: "devadmin",
    },
  });

  await prisma.user.upsert({
    where: { id: "dev-user-2" },
    update: {
      name: "Dev Tester (2)",
      email: "dev2@vcanews.com",
      role: "USER",
      username: "devtester",
    },
    create: {
      id: "dev-user-2",
      name: "Dev Tester (2)",
      email: "dev2@vcanews.com",
      role: "USER",
      username: "devtester",
    },
  });

  const categories = [
    {
      name: "Tecnologia & Programação",
      professions: [
        "Desenvolvedor Full Stack",
        "Desenvolvedor Mobile",
        "Designer de Interface (UI/UX)",
        "Analista de Sistemas",
        "Técnico de Informática",
        "Especialista em Redes",
        "Cientista de Dados",
        "Gestor de TI",
      ],
    },
    {
      name: "Saúde & Bem-estar",
      professions: [
        "Médico Clinico Geral",
        "Enfermeiro(a)",
        "Fisioterapeuta",
        "Psicólogo(a)",
        "Nutricionista",
        "Personal Trainer",
        "Dentista",
        "Fonoaudiólogo(a)",
        "Massoterapeuta",
      ],
    },
    {
      name: "Construção & Reformas",
      professions: [
        "Pedreiro",
        "Eletricista",
        "Encanador",
        "Pintor",
        "Arquiteto(a)",
        "Engenheiro Civil",
        "Mestre de Obras",
        "Gesseiro",
        "Marceneiro",
        "Serralheiro",
      ],
    },
    {
      name: "Automotivo",
      professions: [
        "Mecânico de Automóveis",
        "Eletricista Automotivo",
        "Lanterneiro / Funileiro",
        "Pintor Automotivo",
        "Borracheiro",
        "Lavador de Veículos",
        "Instalador de Som/Acessórios",
      ],
    },
    {
      name: "Beleza & Estética",
      professions: [
        "Cabeleireiro(a)",
        "Barbeiro",
        "Manicure / Pedicure",
        "Esteticista",
        "Maquiador(a)",
        "Designer de Sobrancelhas",
        "Depilador(a)",
      ],
    },
    {
      name: "Eventos & Gastronomia",
      professions: [
        "Cozinheiro(a) / Chef",
        "Confeiteiro(a)",
        "Garçom / Garçonete",
        "Bartender",
        "Fotógrafo(a) de Eventos",
        "Cerimonialista",
        "DJ",
        "Segurança de Eventos",
      ],
    },
    {
      name: "Educação & Aulas",
      professions: [
        "Professor(a) de Idiomas",
        "Professor(a) de Música",
        "Reforço Escolar",
        "Instrutor de Direção",
        "Palestrante",
        "Coach",
      ],
    },
    {
      name: "Serviços Domésticos",
      professions: [
        "Diarista",
        "Cozinheira Doméstica",
        "Babá",
        "Cuidador(a) de Idosos",
        "Jardineiro",
        "Piscineiro",
        "Passadeira",
      ],
    },
    {
      name: "Jurídico & Administrativo",
      professions: [
        "Advogado(a)",
        "Contador(a)",
        "Assistente Administrativo",
        "Secretária Executiva",
        "Corretor(a) de Imóveis",
        "Corretor(a) de Seguros",
      ],
    },
    {
      name: "Marketing & Design",
      professions: [
        "Gestor de Tráfego",
        "Social Media",
        "Redator(a) / Copywriter",
        "Designer Gráfico",
        "Editor de Vídeo",
        "Ilustrador(a)",
        "Analista de Marketing",
      ],
    },
    {
      name: "Outros",
      professions: ["Geral", "Outros"],
    },
  ];

  const productCategories = [
    {
      name: "Eletrônicos & Celulares",
      subcategories: ["Celulares e Smartphones", "Tablets e iPads", "Computadores e Notebooks", "Consoles e Games", "TVs e Áudio", "Câmeras e Drones", "Outros"],
    },
    {
      name: "Veículos & Acessórios",
      subcategories: ["Carros e Sedans", "SUVs e Caminhonetes", "Motos e Scooters", "Peças e Acessórios", "Náutica", "Outros"],
    },
    {
      name: "Imóveis",
      subcategories: ["Apartamentos", "Casas", "Terrenos e Lotes", "Sítios e Fazendas", "Temporada", "Outros"],
    },
    {
      name: "Moda & Beleza",
      subcategories: ["Roupas Femininas", "Roupas Masculinas", "Calçados", "Relógios e Joias", "Beleza e Maquiagem", "Outros"],
    },
    {
      name: "Casa & Eletrodomésticos",
      subcategories: ["Móveis", "Decoração", "Geladeiras e Freezers", "Fogões e Fornos", "Ar Condicionado", "Outros"],
    },
    {
      name: "Esportes & Lazer",
      subcategories: ["Bicicletas", "Fitness e Musculação", "Camping e Pesca", "Instrumentos Musicais", "Outros"],
    },
    {
      name: "Companhia & Pets",
      subcategories: ["Cães e Gatos", "Acessórios e Ração", "Serviços Pet", "Outros"],
    },
    {
      name: "Outros",
      subcategories: ["Geral", "Outros"],
    },
  ];

  console.log("Iniciando seed de categorias de produtos...");

  for (const prodCat of productCategories) {
    const category = await (prisma as any).adCategory.upsert({
      where: { name: prodCat.name },
      update: {},
      create: { name: prodCat.name },
    });

    for (const subName of prodCat.subcategories) {
      await (prisma as any).adSubcategory.upsert({
        where: { name_categoryId: { name: subName, categoryId: category.id } },
        update: {},
        create: {
          name: subName,
          categoryId: category.id,
        },
      });
    }
  }

  console.log("Iniciando seed de categorias e profissões...");

  for (const cat of categories) {
    const category = await prisma.professionCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });

    for (const profName of cat.professions) {
      await prisma.profession.upsert({
        where: { name: profName },
        update: { categoryId: category.id },
        create: {
          name: profName,
          categoryId: category.id,
        },
      });
    }
  }

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
