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
      name: "Eletrônicos & Tecnologia",
      subcategories: [
        "Celulares e Smartphones",
        "Capas e Acessórios para Celular",
        "Tablets e iPads",
        "Smartwatches e Wearables",
        "Computadores Desktop",
        "Notebooks",
        "Monitores",
        "Teclados e Mouses",
        "Impressoras e Scanners",
        "HDs, SSDs e Armazenamento",
        "Redes e Roteadores",
        "Componentes de PC",
        "Consoles",
        "Jogos",
        "Controles e Acessórios Gamer",
        "TVs",
        "Home Theater",
        "Caixas de Som",
        "Fones de Ouvido",
        "Câmeras Fotográficas",
        "Filmadoras",
        "Drones",
        "Outros"
      ]
    },
    {
      name: "Veículos",
      subcategories: [
        "Carros",
        "SUVs",
        "Picapes",
        "Vans e Utilitários",
        "Carros Antigos",
        "Carros Elétricos",
        "Motos",
        "Scooters",
        "Quadriciclos",
        "Barcos e Lanchas",
        "Jet Ski",
        "Peças Automotivas",
        "Som Automotivo",
        "Rodas e Pneus",
        "Acessórios Automotivos",
        "Outros"
      ]
    },
    {
      name: "Imóveis",
      subcategories: [
        "Apartamentos",
        "Casas",
        "Kitnets e Studios",
        "Coberturas",
        "Condomínios",
        "Terrenos",
        "Lotes",
        "Sítios",
        "Fazendas",
        "Chácaras",
        "Imóveis Comerciais",
        "Salas Comerciais",
        "Galpões",
        "Temporada",
        "Quartos para Aluguel",
        "Outros"
      ]
    },
    {
      name: "Moda & Acessórios",
      subcategories: [
        "Roupas Femininas",
        "Roupas Masculinas",
        "Moda Infantil",
        "Calçados Femininos",
        "Calçados Masculinos",
        "Bolsas",
        "Mochilas",
        "Carteiras",
        "Relógios",
        "Joias",
        "Bijuterias",
        "Óculos de Sol",
        "Acessórios de Moda",
        "Outros"
      ]
    },
    {
      name: "Beleza & Saúde",
      subcategories: [
        "Maquiagem",
        "Perfumes",
        "Cuidados com a Pele",
        "Cuidados com o Cabelo",
        "Barbeadores",
        "Secadores e Chapinhas",
        "Produtos de Barbearia",
        "Suplementos",
        "Equipamentos de Estética",
        "Massagem e Relaxamento",
        "Outros"
      ]
    },
    {
      name: "Casa, Móveis & Decoração",
      subcategories: [
        "Sofás",
        "Mesas",
        "Cadeiras",
        "Guarda-Roupas",
        "Camas",
        "Colchões",
        "Móveis Planejados",
        "Estantes",
        "Decoração",
        "Quadros",
        "Iluminação",
        "Tapetes",
        "Cortinas",
        "Utensílios Domésticos",
        "Organização",
        "Outros"
      ]
    },
    {
      name: "Eletrodomésticos",
      subcategories: [
        "Geladeiras",
        "Freezers",
        "Fogões",
        "Cooktops",
        "Fornos",
        "Micro-ondas",
        "Máquinas de Lavar",
        "Secadoras",
        "Lava e Seca",
        "Ar Condicionado",
        "Ventiladores",
        "Aspiradores",
        "Purificadores de Água",
        "Outros"
      ]
    },
    {
      name: "Esportes & Lazer",
      subcategories: [
        "Bicicletas",
        "Peças para Bicicleta",
        "Equipamentos de Academia",
        "Musculação",
        "Corrida",
        "Yoga e Pilates",
        "Camping",
        "Pesca",
        "Skate",
        "Patins",
        "Surf",
        "Instrumentos Musicais",
        "Outros"
      ]
    },
    {
      name: "Bebês & Infantil",
      subcategories: [
        "Carrinhos de Bebê",
        "Cadeirinhas para Carro",
        "Berços",
        "Roupas de Bebê",
        "Brinquedos Infantis",
        "Mamadeiras",
        "Produtos de Higiene",
        "Outros"
      ]
    },
    {
      name: "Pets",
      subcategories: [
        "Cães",
        "Gatos",
        "Aves",
        "Peixes",
        "Roedores",
        "Rações",
        "Brinquedos para Pets",
        "Casinhas",
        "Serviços Veterinários",
        "Outros"
      ]
    },
    {
      name: "Serviços",
      subcategories: [
        "Assistência Técnica",
        "Serviços Automotivos",
        "Reformas e Construção",
        "Serviços Domésticos",
        "Aulas Particulares",
        "Design e Tecnologia",
        "Marketing e Publicidade",
        "Fretes e Mudanças",
        "Eventos",
        "Outros"
      ]
    },
    {
      name: "Empregos",
      subcategories: [
        "Tecnologia",
        "Administrativo",
        "Vendas",
        "Marketing",
        "Saúde",
        "Educação",
        "Construção",
        "Serviços Gerais",
        "Estágio",
        "Freelancer",
        "Outros"
      ]
    },
    {
      name: "Outros",
      subcategories: [
        "Antiguidades",
        "Colecionáveis",
        "Livros",
        "Revistas",
        "Cursos",
        "Artesanato",
        "Produtos Personalizados",
        "Outros"
      ]
    }
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
