import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
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
  ];

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
  });
