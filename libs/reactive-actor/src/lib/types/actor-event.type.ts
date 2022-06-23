import { Event, SendConfig } from "../interfaces"

export type ActorEvent<T extends Event = Event> = T & SendConfig