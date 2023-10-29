export interface DayModel {
    id: string;
    day: string;
    image: unknown;
}

export const useDays = (calendarId: MaybeRefOrGetter<string>) => {
    const { pb } = usePocketBase()
    const days = ref<DayModel[]>([])

    const fetchDays = async (cid: string) => {
        days.value = await pb.collection("days")
            .getFullList({ filter: `calendar.id = '${cid}'` })
    }

    const createDay = async (image: File, day: number) => {
        const formData = new FormData()
        formData.append("calendar", toValue(calendarId))
        formData.append("image", image)
        formData.append("day", day.toString())
        const record = await pb.collection("days").create(formData)
        fetchDays(toValue(calendarId))
        return record
    }

    watchEffect(() => {
        const cid = toValue(calendarId)
        if (cid) {
            fetchDays(cid)
        } else {
            days.value = []
        }
    })

    return { days, createDay }
}
