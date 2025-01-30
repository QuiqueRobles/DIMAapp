import { createContext, useContext, useState } from "react"
export type Event = {
    club_id: string,
    name: string,
    date: Date,
    created_at: string,
    price: number,
    description: string,
    image: string,
    event_id: string,
  }

type ClubContextType = {
  events: Event[]
  clubId: string
  setClubId: (clubId: string) => void;
  addEvent: (event: Event) => void
  setEvents: (event: Event[]) => void
}


const ClubContext = createContext<ClubContextType | undefined>(undefined)

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [clubId,setClubId]=useState("0"); 

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event])
  }

  return <ClubContext.Provider value={{ events,clubId,setClubId, addEvent,setEvents(event) {
      
  }, }}>{children}</ClubContext.Provider>
}

export function useClub() {
  const context = useContext(ClubContext)
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}

