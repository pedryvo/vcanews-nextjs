"use client";

import { useState, useEffect, useRef } from "react";

interface BlogPost {
  id: number;
  titulo: string;
  url: string;
  imageUrl: string | null;
  dataPublicacao: string | Date;
  blog: {
    nome: string;
  };
}

interface NewsTimelineProps {
  initialPosts: any[];
}

export default function NewsTimeline({ initialPosts }: NewsTimelineProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [skip, setSkip] = useState(initialPosts.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchMorePosts = async () => {
    if (loading || !hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    try {
      const take = 12;
      const response = await fetch(`/api/posts?skip=${skip}&take=${take}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const newPosts = await response.json();

      // Verifica se newPosts é realmente um array para evitar crash
      if (!Array.isArray(newPosts)) {
        console.error("API did not return an array:", newPosts);
        setHasMore(false);
        return;
      }

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => {
        // Filtra para garantir que não adicionamos posts repetidos por ID
        // Proteção extra contra posts nulos ou inválidos
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNewPosts = newPosts.filter((p: any) => p && p.id && !existingIds.has(p.id));
        
        if (uniqueNewPosts.length === 0 && newPosts.length > 0) {
          // Se todos os posts retornados já existem, talvez a lista tenha "andado"
          // Vamos aumentar o skip para tentar pegar os próximos na próxima iteração
          setSkip((s) => s + newPosts.length);
        }

        return [...prev, ...uniqueNewPosts];
      });

      setSkip((prevSkip) => prevSkip + newPosts.length);
      
      if (newPosts.length < take) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    const handleRefreshNews = () => {
      setPosts([]);
      setSkip(0);
      setHasMore(true);
      // O fetchMorePosts será disparado automaticamente pelo IntersectionObserver
      // assim que o container esvaziar e o observerTarget ficar visível
    };

    window.addEventListener("refresh-news", handleRefreshNews);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      window.removeEventListener("refresh-news", handleRefreshNews);
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, skip, hasMore, loading]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((item) => (
          <a 
            key={item.id} 
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-primary/30 flex flex-col"
          >
            {item.imageUrl && (
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.titulo}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                  {item.blog.nome}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.dataPublicacao).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                {item.titulo}
              </h3>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-primary flex items-center group-hover:underline">
                  Ler mais no blog
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Trigger element for IntersectionObserver */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center w-full">
        {loading && (
          <div className="flex items-center gap-2 text-primary font-medium">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Carregando mais notícias...
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-muted-foreground italic">Você chegou ao fim das notícias.</p>
        )}
      </div>
    </div>
  );
}
