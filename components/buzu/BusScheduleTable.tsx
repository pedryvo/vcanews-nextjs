import * as React from "react";
import { Clock, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusSchedule } from "@/lib/bus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BusScheduleTableProps {
  schedules: BusSchedule[];
}

export function BusScheduleTable({ schedules }: BusScheduleTableProps) {
  if (schedules.length === 0) {
    return (
      <Card className="border-dashed bg-muted/50">
        <CardContent className="py-16 text-center text-muted-foreground italic">
          Nenhum horário disponível para este tipo de dia.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {schedules.map((schedule, index) => {
        const entries = schedule.times
          .map((time, i) => ({ time, via: schedule.vias?.[i] }))
          .filter(e => e.time && e.time !== "---" && e.time.trim() !== "");
        
        if (entries.length === 0 && !schedule.header) return null;

        return (
          <Card key={`${schedule.header}-${index}`} className="group hover:shadow-xl transition-all duration-300 border-none bg-card/60 backdrop-blur-md shadow-lg overflow-hidden w-full">
            <CardHeader className="bg-primary/5 py-4 px-4 flex flex-row items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Navigation size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base font-bold text-foreground truncate">
                  {schedule.header || "Ponto de Referência"}
                </CardTitle>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none block">
                  Local de Partida
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 bg-background/40">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {entries.map((entry, tIndex) => (
                  <div 
                    key={`${entry.time}-${tIndex}`} 
                    className={cn(
                      "px-1 py-2 rounded-md transition-all duration-300 border border-muted flex flex-col items-center justify-center min-h-[45px]",
                      "bg-muted/30 text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/50 cursor-default"
                    )}
                  >
                    <span className="text-xs sm:text-sm font-bold font-mono tracking-tighter leading-none">{entry.time}</span>
                    {entry.via && entry.via !== "---" && entry.via.trim() !== "" && (
                      <span className="text-[8px] sm:text-[9px] uppercase font-sans font-black opacity-70 tracking-tighter leading-none mt-1 text-center truncate w-full px-1">
                        {entry.via}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-between opacity-50 text-[10px] font-medium border-t pt-2 border-muted">
                 <span className="flex items-center gap-1">
                  <Clock size={10} /> {entries.length} horários
                 </span>
                 <span>PMVC - VcaBuzu</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
