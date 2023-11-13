import type { CalendarModel } from "./useCalendars";

export interface DayModel {
    id: string;
    day: string;
    image: string;
    url?: string;
}

export const useCalendar = (id: MaybeRefOrGetter<string>) => {
    const { pb } = usePocketBase()
    const days = ref<DayModel[]>([])
    const calendar = ref<CalendarModel>()

    const fetchDays = async () => {
        days.value = await pb.collection("days")
            .getFullList({ filter: `calendar.id = '${toValue(id)}'` })

        const fileToken = await pb.files.getToken() 
        for (const d of days.value) {
            const url = pb.files.getUrl(d, d.image, {'token': fileToken})
            d.url = url
        }
    }

    const fetchCalendar = async () => {
        calendar.value = await pb.collection("calendars")
          .getOne(toValue(id))
    }

    const createDay = async (image: File, day: number) => {
        const formData = new FormData()
        formData.append("calendar", toValue(id))
        formData.append("image", image)
        formData.append("day", day.toString())
        const record = await pb.collection("days").create(formData)
        fetchDays()
        return record
    }

    const updateDay = async (image: File, dayId: string) => {
        const formData = new FormData()
        formData.append("calendar", toValue(id))
        formData.append("image", image)
        const record = await pb.collection("days").update(dayId, formData)
        fetchDays()
        return record
    }

    watchEffect(() => {
        if (toValue(id)) {
            fetchCalendar()
            fetchDays()
        } else {
            days.value = []
        }
    })

    return { days, createDay, calendar, updateDay }
}
