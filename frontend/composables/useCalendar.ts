import type { CalendarModel } from "./useCalendars";

export interface DayModel {
    id: string;
    day: string;
    image: string;
    url?: string;
}

export const useCalendar = async (id: MaybeRefOrGetter<string>, pwd?: MaybeRefOrGetter<string>) => {
    const { pb } = usePocketbase()
    const days = ref<DayModel[]>([])
    const calendar = ref<CalendarModel>({
        id: "",
        user: "",
        playlist: "",
        password: "",
    })

    function setPwdHeader(password: string) {
        pb.beforeSend = function(_, options) {
            if (!options.headers) {
                options.headers = {}
            }
            options.headers['pwd'] = password
            return {}
        }
    }

    const pwdValue = toValue(pwd)
    if (pwdValue) {
        setPwdHeader(pwdValue)
    }

    const fetchDays = async () => {
        days.value = await pb.collection("days")
            .getFullList({ filter: `calendar.id = '${toValue(id)}'` })

        const fileToken = await pb.files.getToken()
        for (const d of days.value) {
            let url = pb.files.getUrl(d, d.image, { 'token': fileToken })
            if (toValue(pwd)) {
                const res = await fetch(url, {
                    headers: new Headers({
                        "pwd": toValue(pwd) || ''
                    })
                })
                const blob = await res.blob()
                url = URL.createObjectURL(blob)
            }
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

    const updateCalendar = async (calendar: CalendarModel) => {
        await pb.collection("calendar").update(calendar.id, calendar)
    }

    const link = computed(() => {
        if (!calendar.value) {
            return undefined
        }
        const path = window.location.toString() + "/share"
        const url = new URL(path)
        url.searchParams.set("pwd", calendar.value.password)
        return url.toString()
    })

    watchEffect(() => {
        if (toValue(id)) {
            fetchCalendar()
            fetchDays()
        }
    })

    return { days, createDay, calendar, updateDay, updateCalendar, link }
}
