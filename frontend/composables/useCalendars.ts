
export interface CalendarModel {
    id: string
    user: string
    playlist: string
}

export const useCalendars = () => {
    const { pb, userId } = usePocketBase()
    const calendars = ref<CalendarModel[]>([])


    const createCalendar = async () => {
        const record = await pb.collection<CalendarModel>("calendars")
            .create({
                "user": toValue(userId)
            })
        fetchCalendars()
        return record
    }

    const fetchCalendars = async () => {
        calendars.value = await pb.collection<CalendarModel>("calendars").getFullList()
    }


    return { calendars, createCalendar, fetchCalendars }
}

