export interface BusSchedule {
  header: string;
  times: string[];
  vias?: string[];
}

export interface BusLine {
  id: string;
  name: string;
  itineraryIda: string;
  itineraryVolta: string;
  weekdaysSchedule: BusSchedule[];
  saturdaysSchedule: BusSchedule[];
  sundaysSchedule: BusSchedule[];
}

export function processSchedules(schedules: BusSchedule[]): BusSchedule[] {
  const result: BusSchedule[] = [];
  
  for (let i = 0; i < schedules.length; i++) {
    const current = schedules[i];
    
    // Skip placeholder / empty entries if somehow they reached here
    if (!current.header && current.times.every(t => !t || t === "---")) continue;

    // Check if current is a "Via" column
    const isViaHeader = current.header.toLowerCase().trim() === "via";
    
    // Clean times from things like @atd
    const cleanTimes = current.times.map(t => (t || "").replace(/@atd/g, "").trim());
    
    if (isViaHeader && result.length > 0) {
      // Pair with previous schedule
      const previous = result[result.length - 1];
      previous.vias = cleanTimes;
    } else if (!isViaHeader) {
      // Normal schedule, add to result
      result.push({ 
        ...current, 
        times: cleanTimes 
      });
    }
  }
  
  return result;
}

export async function fetchBusLines(): Promise<BusLine[]> {
  const response = await fetch("https://api-vodebuzu.pmvc.ba.gov.br/modules", {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bus lines");
  }

  return response.json();
}
