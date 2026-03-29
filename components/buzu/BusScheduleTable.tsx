import * as React from "react";
import { Clock, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusSchedule } from "@/lib/bus";
import { Badge } from "@/components/ui/badge";

interface BusScheduleTableProps {
  schedules: BusSchedule[];
}

export function BusScheduleTable({ schedules }: BusScheduleTableProps) {
  if (schedules.length === 0) {
    return (
      <div className="border border-dashed rounded-xl bg-muted/50 py-16 text-center text-muted-foreground italic">
        Nenhum horário disponível para este tipo de dia.
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6">
      {schedules.map((schedule, index) => {
        const entries = schedule.times
          .map((time, i) => ({ time, via: schedule.vias?.[i] }))
          .filter(e => e.time && e.time !== "---" && e.time.trim() !== "");
        
        if (entries.length === 0 && !schedule.header) return null;

        return (
          <div
            key={`${schedule.header}-${index}`}
            className="w-full max-w-full rounded-xl border-none bg-card/60 backdrop-blur-md shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="bg-primary/5 py-4 px-4 flex items-center gap-3">
              <div className="shrink-0 p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Navigation size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-foreground truncate">
                  {schedule.header || "Ponto de Referência"}
                </h3>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none block">
                  Local de Partida
                </span>
              </div>
            </div>

            {/* Time boxes */}
            <div className="p-3 sm:p-4 bg-background/40">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {entries.map((entry, tIndex) => (
                  <div 
                    key={`${entry.time}-${tIndex}`} 
                    className={cn(
                      "min-w-0 py-2 px-1 rounded-md transition-all duration-300 border border-muted flex flex-col items-center justify-center",
                      "bg-muted/30 text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/50 cursor-default"
                    )}
                  >
                    <span className="text-xs sm:text-sm font-bold font-mono tracking-tighter leading-none">{entry.time}</span>
                    {entry.via && entry.via !== "---" && entry.via.trim() !== "" && (
                      <span className="text-[7px] sm:text-[9px] uppercase font-sans font-black opacity-70 tracking-tighter leading-none mt-1.5 text-center truncate w-full px-0.5">
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
