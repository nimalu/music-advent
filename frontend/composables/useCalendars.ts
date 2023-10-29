
export interface CalendarModel {
    id: string
    creator: string
    playlist: string
    recipients: string
    name: string
}

export const useCalendars = () => {
    const { pb, getUserId } = usePocketBase()
    const calendars = ref<CalendarModel[]>([])


    const createCalendar = async (name: string) => {
        const record = await pb.collection<CalendarModel>("calendars")
            .create({
                "creator": getUserId(),
                "name": name
            })
        fetchCalendars()
        return record
    }

    const fetchCalendars = async () => {
        calendars.value = await pb.collection<CalendarModel>("calendars").getFullList()
    }

    fetchCalendars()

    return { calendars, createCalendar }
}

