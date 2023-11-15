
export interface CalendarModel {
    id: string
    user: string
    playlist: string
}

export const useCalendars = async () => {
    const { pb } = await usePocketbase()
    const calendars = ref<CalendarModel[]>([])


    const createCalendar = async () => {
        const record = await pb.collection<CalendarModel>("calendars")
            .create({
                "user": toValue(pb.authStore.model.id)
            })
        fetchCalendars()
        return record
    }

    const fetchCalendars = async () => {
        calendars.value = await pb.collection<CalendarModel>("calendars").getFullList()
    }


    return { calendars, createCalendar, fetchCalendars }
}

