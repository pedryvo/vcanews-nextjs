"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Bus, Clock, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusLine, processSchedules } from "@/lib/bus";
import { BusTimeline } from "./BusTimeline";
import { BusScheduleTable } from "./BusScheduleTable";
import { Card, CardContent } from "@/components/ui/card";

interface BusDashboardProps {
  initialLines: BusLine[];
}

export function BusDashboard({ initialLines }: BusDashboardProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedLineId, setSelectedLineId] = React.useState<string>("");
  const [direction, setDirection] = React.useState<"ida" | "volta">("ida");
  const [dayType, setDayType] = React.useState<"week" | "sat" | "sun">("week");

  const [activeTab, setActiveTab] = React.useState<string>("horarios");

  const selectedLine = initialLines.find((line) => line.id === selectedLineId);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Search Section */}
      <section className="flex flex-col items-center justify-center space-y-4 py-8">
        <h2 className="text-2xl font-bold text-foreground">Aonde vamos hoje?</h2>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full max-w-md justify-between bg-card hover:bg-accent/50 border-input transition-all h-12 shadow-lg"
            >
              {selectedLine ? selectedLine.name : "Selecione uma linha ou busque..."}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-md p-0" align="center">
            <Command>
              <CommandInput placeholder="Digite o nome ou número da linha..." />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>Nenhuma linha encontrada.</CommandEmpty>
                <CommandGroup>
                  {initialLines.map((line) => (
                    <CommandItem
                      key={line.id}
                      value={line.name}
                      onSelect={() => {
                        setSelectedLineId(line.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedLineId === line.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {line.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </section>

      {selectedLine && (
        <div className="grid gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <Tabs defaultValue="horarios" onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <TabsList className="bg-muted p-1 rounded-xl shadow-inner h-12">
                <TabsTrigger value="horarios" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all flex items-center gap-2">
                  <Clock size={16} /> Horários
                </TabsTrigger>
                <TabsTrigger value="itinerario" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all flex items-center gap-2">
                  <MapPin size={16} /> Itinerário
                </TabsTrigger>
              </TabsList>

              {/* Direction Toggle - Only show for Itinerary */}
              {activeTab === "itinerario" && (
                <div className="flex bg-muted p-1 rounded-xl shadow-inner h-12 animate-in fade-in zoom-in-95 duration-300">
                  <button
                    onClick={() => setDirection("ida")}
                    className={cn(
                      "px-6 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      direction === "ida" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Ida
                  </button>
                  <button
                    onClick={() => setDirection("volta")}
                    className={cn(
                      "px-6 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      direction === "volta" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Volta
                  </button>
                </div>
              )}
            </div>

            <TabsContent value="horarios">
               <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                <Button 
                  variant={dayType === "week" ? "default" : "outline"} 
                  onClick={() => setDayType("week")}
                  className="rounded-full px-6"
                >
                  Segunda a Sexta
                </Button>
                <Button 
                  variant={dayType === "sat" ? "default" : "outline"} 
                  onClick={() => setDayType("sat")}
                  className="rounded-full px-6"
                >
                  Sábado
                </Button>
                <Button 
                  variant={dayType === "sun" ? "default" : "outline"} 
                  onClick={() => setDayType("sun")}
                  className="rounded-full px-6"
                >
                  Domingo / Feriado
                </Button>
               </div>
               <BusScheduleTable 
                schedules={processSchedules(
                  dayType === "week" ? selectedLine.weekdaysSchedule :
                  dayType === "sat" ? selectedLine.saturdaysSchedule :
                  selectedLine.sundaysSchedule
                )} 
               />
            </TabsContent>

            <TabsContent value="itinerario">
              <BusTimeline itinerary={direction === "ida" ? selectedLine.itineraryIda : selectedLine.itineraryVolta} />
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {!selectedLine && (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-20 opacity-50">
            <Bus size={48} className="mb-4" />
            <p className="text-center italic">Escolha uma linha acima para ver os detalhes.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
