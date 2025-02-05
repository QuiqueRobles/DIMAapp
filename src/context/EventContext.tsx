import { createContext, useContext, useState } from "react"
import { string } from "zod"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"
export type Event = {
    club_id: string | null
    name: string
    date: string
    created_at: string | null
    price: number |null
    description: string | null
    image: string | null
    id: string | null
  }

type ClubContextType = {
  events: Event[]
  clubId: string | null
  setClubId: (clubId: string | null) => void;
  addEvent: (events: Event) => void
  setEvents: (events: Event[]) => void
  refresh:any
  setRefresh:(refresh:number)=>void;
}


const ClubContext = createContext<ClubContextType | undefined>(undefined);

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubId, setClubId] = useState<string | null>(null); // Initialize with null
  const[refresh,setRefresh]=useState(0);

  useEffect(() => {
    const fetchClubId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
         if (!user)  return;
         
        console.log("club:", user.id);
        setClubId(user.id); // Set clubId when fetched
      } catch (error) {
        console.error(error);
      }
    };

    fetchClubId();
  }, []); // Empty dependency array ensures this runs once when the component mounts


  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event])
  }

  return <ClubContext.Provider value={{ events,clubId,setClubId, addEvent,setEvents,refresh,setRefresh}}>{children}</ClubContext.Provider>
}

export function useClub() {
  const context = useContext(ClubContext)
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}

