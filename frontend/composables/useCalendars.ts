import { randomString } from "~/utils"

export interface CalendarModel {
    id: string
    user: string
    playlist: string
    password: string
}

export const useCalendars = () => {
    const { pb } = usePocketbase()
    const calendars = ref<CalendarModel[]>([])

    const createCalendar = async () => {
        const record = await pb.collection<CalendarModel>("calendars")
            .create({
                "user": toValue(pb.authStore.model?.id),
                "password": randomString(24)
            })
        return record
    }

    const fetchCalendars = async () => {
        calendars.value = await pb.collection<CalendarModel>("calendars").getFullList()
    }

    return { calendars, createCalendar, fetchCalendars }
}

