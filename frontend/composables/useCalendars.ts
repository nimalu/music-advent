
export interface CalendarModel {
    id: string
    user: string
    playlist: string
}

export const useCalendars = () => {
    const { pb, getUserId } = usePocketBase()
    const calendars = ref<CalendarModel[]>([])


    const createCalendar = async () => {
        const record = await pb.collection<CalendarModel>("calendars")
            .create({
                "user": getUserId(),
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

