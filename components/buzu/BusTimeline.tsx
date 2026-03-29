import * as React from "react";
import { Circle, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface BusTimelineProps {
  itinerary: string;
}

export function BusTimeline({ itinerary }: BusTimelineProps) {
  const stops = itinerary
    .split("\n")
    .map((stop) => stop.trim())
    .filter((stop) => stop.length > 0);

  if (stops.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center text-muted-foreground italic">
          Nenhuma parada detalhada disponível para este sentido.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-background to-muted/20 shadow-xl">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <MapPin size={20} className="text-primary" />
          Pontos de Parada
          <span className="text-xs font-normal text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-full">
            {stops.length} paradas
          </span>
        </h3>
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="relative pl-8 space-y-6">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted transition-all duration-500" />
            
            {stops.map((stop, index) => (
              <div 
                key={`${stop}-${index}`} 
                className="relative group animate-in slide-in-from-left-2 duration-300" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Dot */}
                <div 
                  className={cn(
                    "absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background shadow-sm transition-all group-hover:scale-125 z-10",
                    index === 0 ? "bg-primary scale-110" : 
                    index === stops.length - 1 ? "bg-destructive" : 
                    "bg-muted-foreground group-hover:bg-primary"
                  )} 
                />
                
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    index === 0 ? "text-primary text-base font-bold" : 
                    index === stops.length - 1 ? "text-destructive" : 
                    "text-foreground group-hover:text-primary"
                  )}>
                    {stop}
                  </span>
                  {index === 0 && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                      Partida / Origem
                    </span>
                  )}
                  {index === stops.length - 1 && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1">
                      Destino Final
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 flex justify-center text-muted-foreground opacity-30">
          <ChevronDown className="animate-bounce" size={24} />
        </div>
      </CardContent>
    </Card>
  );
}
