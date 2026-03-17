import { prisma } from "../lib/db";

async function main() {

  const categories = [
    {
      name: "Tecnologia & Programação",
      professions: [
        "Desenvolvedor Frontend",
        "Desenvolvedor Backend",
        "Desenvolvedor Full Stack",
        "Desenvolvedor Mobile",
        "Desenvolvedor React",
        "Desenvolvedor Node.js",
        "Desenvolvedor Ruby on Rails",
        "Engenheiro de Software",
        "Analista de Sistemas",
        "Administrador de Banco de Dados (DBA)",
        "Cientista de Dados",
        "Engenheiro de Dados",
        "Especialista em Inteligência Artificial",
        "Especialista em Machine Learning",
        "DevOps",
        "Administrador de Redes",
        "Especialista em Segurança da Informação",
        "Técnico de Informática",
        "Suporte Técnico",
        "Gestor de TI",
        "QA / Testador de Software"
      ],
    },
    {
      name: "Saúde & Bem-estar",
      professions: [
        "Médico Clínico Geral",
        "Médico Especialista",
        "Enfermeiro(a)",
        "Técnico de Enfermagem",
        "Fisioterapeuta",
        "Psicólogo(a)",
        "Psiquiatra",
        "Nutricionista",
        "Dentista",
        "Ortodontista",
        "Fonoaudiólogo(a)",
        "Terapeuta Ocupacional",
        "Massoterapeuta",
        "Quiropraxista",
        "Acupunturista",
        "Personal Trainer",
        "Instrutor de Yoga",
        "Instrutor de Pilates"
      ],
    },
    {
      name: "Construção & Reformas",
      professions: [
        "Pedreiro",
        "Servente de Pedreiro",
        "Eletricista",
        "Eletricista Predial",
        "Encanador",
        "Instalador Hidráulico",
        "Pintor Residencial",
        "Pintor Industrial",
        "Arquiteto(a)",
        "Engenheiro Civil",
        "Mestre de Obras",
        "Gesseiro",
        "Drywall",
        "Marceneiro",
        "Carpinteiro",
        "Serralheiro",
        "Vidraceiro",
        "Instalador de Piso",
        "Instalador de Porcelanato",
        "Impermeabilizador"
      ],
    },
    {
      name: "Automotivo",
      professions: [
        "Mecânico de Automóveis",
        "Mecânico de Motos",
        "Eletricista Automotivo",
        "Funileiro / Lanterneiro",
        "Pintor Automotivo",
        "Borracheiro",
        "Balanceamento e Alinhamento",
        "Lavador de Veículos",
        "Polimento Automotivo",
        "Estética Automotiva",
        "Instalador de Som Automotivo",
        "Instalador de Insulfilm",
        "Instalador de Alarmes"
      ],
    },
    {
      name: "Beleza & Estética",
      professions: [
        "Cabeleireiro(a)",
        "Colorista",
        "Barbeiro",
        "Manicure",
        "Pedicure",
        "Esteticista",
        "Maquiador(a)",
        "Designer de Sobrancelhas",
        "Lash Designer",
        "Depilador(a)",
        "Micropigmentador(a)",
        "Especialista em Harmonização Facial",
        "Trancista",
        "Tatuador(a)",
        "Body Piercer"
      ],
    },
    {
      name: "Eventos & Gastronomia",
      professions: [
        "Chef de Cozinha",
        "Cozinheiro(a)",
        "Confeiteiro(a)",
        "Salgadeiro(a)",
        "Churrasqueiro",
        "Garçom / Garçonete",
        "Bartender",
        "Barista",
        "Fotógrafo(a)",
        "Videomaker",
        "DJ",
        "Músico para Eventos",
        "Cerimonialista",
        "Decorador de Eventos",
        "Organizador de Eventos",
        "Segurança de Eventos"
      ],
    },
    {
      name: "Educação & Aulas",
      professions: [
        "Professor Particular",
        "Professor de Matemática",
        "Professor de Português",
        "Professor de Inglês",
        "Professor de Espanhol",
        "Professor de Música",
        "Professor de Violão",
        "Professor de Piano",
        "Professor de Canto",
        "Instrutor de Informática",
        "Instrutor de Programação",
        "Instrutor de Direção",
        "Preparador para Concursos",
        "Tutor Online",
        "Palestrante",
        "Coach"
      ],
    },
    {
      name: "Serviços Domésticos",
      professions: [
        "Diarista",
        "Empregada Doméstica",
        "Cozinheira Doméstica",
        "Babá",
        "Cuidador(a) de Idosos",
        "Cuidador(a) de Crianças",
        "Jardineiro",
        "Paisagista",
        "Piscineiro",
        "Passadeira",
        "Lavador de Roupas",
        "Faxineiro(a)",
        "Caseiro"
      ],
    },
    {
      name: "Jurídico & Administrativo",
      professions: [
        "Advogado(a)",
        "Advogado Trabalhista",
        "Advogado Civil",
        "Advogado Criminal",
        "Contador(a)",
        "Auditor(a)",
        "Consultor Financeiro",
        "Assistente Administrativo",
        "Secretária Executiva",
        "Analista Financeiro",
        "Corretor(a) de Imóveis",
        "Corretor(a) de Seguros",
        "Despachante"
      ],
    },
    {
      name: "Marketing & Design",
      professions: [
        "Gestor de Tráfego",
        "Social Media",
        "Analista de Marketing Digital",
        "Especialista em SEO",
        "Especialista em Google Ads",
        "Copywriter",
        "Redator(a)",
        "Designer Gráfico",
        "Designer UI/UX",
        "Web Designer",
        "Editor de Vídeo",
        "Motion Designer",
        "Ilustrador(a)",
        "Fotógrafo(a)",
        "Produtor de Conteúdo"
      ],
    },
    {
      name: "Logística & Transporte",
      professions: [
        "Motorista Particular",
        "Motorista de Aplicativo",
        "Motorista de Caminhão",
        "Motoboy",
        "Entregador",
        "Freteiro",
        "Mudanças Residenciais",
        "Operador de Empilhadeira",
        "Auxiliar de Logística"
      ],
    },
    {
      name: "Outros",
      professions: [
        "Tradutor",
        "Intérprete",
        "Artesão",
        "Artista",
        "Escritor",
        "Consultor",
        "Freelancer Geral",
        "Outros"
      ],
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

  // Remover categorias que não estão no seed
  const productCategoryNames = productCategories.map(c => c.name);
  await (prisma as any).adCategory.deleteMany({
    where: { name: { notIn: productCategoryNames } }
  });

  for (const prodCat of productCategories) {
    const category = await (prisma as any).adCategory.upsert({
      where: { name: prodCat.name },
      update: {},
      create: { name: prodCat.name },
    });

    // Remover subcategorias órfãs desta categoria
    await (prisma as any).adSubcategory.deleteMany({
      where: {
        categoryId: category.id,
        name: { notIn: prodCat.subcategories }
      }
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

  // Remover categorias de profissão que não estão no seed
  const professionCategoryNames = categories.map(c => c.name);
  await prisma.professionCategory.deleteMany({
    where: { name: { notIn: professionCategoryNames } }
  });

  for (const cat of categories) {
    const category = await prisma.professionCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });

    // Remover profissões órfãs desta categoria
    // Nota: Como nome é @unique em Profession, podemos usar notIn direto se for global,
    // mas aqui limpamos apenas dentro da categoria para ser mais preciso no mapeamento.
    await prisma.profession.deleteMany({
      where: {
        categoryId: category.id,
        name: { notIn: cat.professions }
      }
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
