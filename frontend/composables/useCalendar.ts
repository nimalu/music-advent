import type { PlaylistedTrack, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import type { CalendarModel } from "./useCalendars";
import type Client from "pocketbase";


export const useCalendar = (id: MaybeRefOrGetter<string>, pwd?: MaybeRefOrGetter<string>) => {
    const { pb } = usePocketbase()
    const { sdk } = useSpotify()

    const calendar = ref<Calendar>({
        id: '',
        password: '',
        user: '',
        days: {},
        playlistItems: []
    })

    const pwdValue = toValue(pwd)
    if (pwdValue) {
        setPwdHeader(pb, pwdValue)
    }

    async function getImageUrl(d: DayModel, fileToken: string) {
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
        return url
    }

    async function fetchDays() {
        const days = await pb.collection<DayModel>("days")
            .getFullList({ filter: `calendar.id="${toValue(id)}"` })

        const fileToken = await pb.files.getToken()
        calendar.value.days = {}
        for (const d of days) {
            d.url = await getImageUrl(d, fileToken)
            calendar.value.days[d.day] = d
        }
    }

    async function fetchDay(options: { day: string | number, id?: undefined } | { id: string, day?: undefined }) {
        let filter = `calendar.id='${toValue(id)}'&&`
        if (options.day) {
            filter += `day='${options.day}'`
        } else {
            filter += `id='${options.id}'`
        }
        const day = await pb.collection<DayModel>("days").getFirstListItem(filter)
        const fileToken = await pb.files.getToken()
        day.url = await getImageUrl(day, fileToken)
        calendar.value.days[day.day] = day
    }


    async function fetchCalendar() {
        const { id: cid, user, playlist, password } = await pb.collection<CalendarModel>("calendars")
            .getOne(toValue(id))
        calendar.value.id = cid
        calendar.value.user = user
        calendar.value.password = password

        let p: SimplifiedPlaylist
        if (playlist) {
            p = await sdk.playlists.getPlaylist(playlist)
        } else {
            p = (await sdk.currentUser.playlists.playlists(1)).items[0]
        }
        calendar.value.playlist = p
        calendar.value.playlistItems = (await sdk.playlists.getPlaylistItems(p.id)).items
    }

    const createDay = async (image: File, day: number) => {
        const formData = new FormData()
        formData.append("calendar", toValue(id))
        formData.append("image", image)
        formData.append("day", day.toString())
        const record = await pb.collection("days").create(formData)
        fetchDay({ day })
        return record
    }

    const updateDay = async (image: File, dayId: string) => {
        const formData = new FormData()
        formData.append("calendar", toValue(id))
        formData.append("image", image)
        const record = await pb.collection("days").update(dayId, formData)
        fetchDay({ id: dayId })
        return record
    }

    const updateCalendar = async (calendar: Partial<CalendarModel> & Pick<CalendarModel, "id">) => {
        await pb.collection("calendars").update(calendar.id, calendar)
        await fetchCalendar()
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

    async function fetchAll() {
        fetchCalendar()
        fetchDays()
    }

    fetchAll()

    return { calendar, updateCalendar, createDay, updateDay, link }
}

export interface DayModel {
    id: string;
    day: string;
    image: string;
    url?: string;
}

interface Calendar {
    id: string,
    password: string,
    user: string,
    playlist?: SimplifiedPlaylist,
    playlistItems: PlaylistedTrack[]
    days: Record<string, DayModel>
}

function setPwdHeader(pb: Client, password: string) {
    pb.beforeSend = function(_, options) {
        if (!options.headers) {
            options.headers = {}
        }
        options.headers['pwd'] = password
        return {}
    }
}
