import type { PlaylistedTrack } from "@spotify/web-api-ts-sdk";

interface Day {
    content?: DayModel;
    track?: PlaylistedTrack;
    loading: boolean;
}

function generateEmptyDays() {
    const days: Day[] = [];
    for (let i = 0; i < 24; i++) {
        days.push({ loading: false });
    }
    return days;
}

export const useDays = (calendarId: MaybeRefOrGetter<string>, pwd?: string) => {
    const { pb } = usePocketbase();
    const { sdk } = useSpotify();
    const days = ref<Day[]>(generateEmptyDays());

    const { calendar } = useCalendar(calendarId, pwd);

    async function fetchPlaylist() {
        const playlist = calendar.value.playlist;
        if (!playlist) {
            for (let i = 0; i < days.value.length; i++) {
                days.value[i].track = undefined;
            }
            return;
        }
        const tracksPage = await sdk.playlists.getPlaylistItems(playlist.id);
        const items = tracksPage.items;

        for (let i = 0; i < days.value.length; i++) {
            if (i < items.length) {
                days.value[i].track = items[i];
            } else {
                days.value[i].track = undefined;
            }
        }
    }
    watch(
        () => calendar.value.playlist,
        () => fetchPlaylist()
    );
    fetchPlaylist()

    async function getImageUrl(d: DayModel, fileToken: string) {
        let url = pb.files.getUrl(d, d.image, { token: fileToken });
        if (toValue(pwd)) {
            const res = await fetch(url, {
                headers: new Headers({
                    pwd: toValue(pwd) || "",
                }),
            });
            const blob = await res.blob();
            url = URL.createObjectURL(blob);
        }
        return url;
    }

    async function fetchDays() {
        for (let i = 0; i < days.value.length; i++) {
            days.value[i].loading = true;
        }
        const daysRaw = await pb
            .collection<DayModel>("days")
            .getFullList({ filter: `calendar.id="${calendarId}"` });

        const fileToken = await pb.files.getToken();
        for (const dayContent of daysRaw) {
            const door = Number.parseInt(dayContent.day);
            dayContent.url = await getImageUrl(dayContent, fileToken);
            days.value[door - 1].content = dayContent;
            days.value[door - 1].loading = false;
        }
        for (let i = 0; i < days.value.length; i++) {
            days.value[i].loading = false;
        }
    }

    async function fetchDay(
        options:
            | { day: string | number; id?: undefined }
            | { id: string; day?: undefined }
    ) {
        let filter = `calendar.id='${calendarId}'&&`;
        if (options.day) {
            filter += `day='${options.day}'`;
            const door = Number.parseInt(options.day.toString());
            days.value[door - 1].loading = true;
        } else {
            filter += `id='${options.id}'`;
        }
        const day = await pb
            .collection<DayModel>("days")
            .getFirstListItem(filter);
        const door = Number.parseInt(day.day);
        const fileToken = await pb.files.getToken();
        day.url = await getImageUrl(day, fileToken);
        days.value[door - 1].content = day;
        days.value[door - 1].loading = false;
    }

    const createDay = async (image: File, day: number) => {
        const formData = new FormData();
        formData.append("calendar", calendarId);
        formData.append("image", image);
        formData.append("day", day.toString());
        const record = await pb.collection("days").create(formData);
        fetchDay({ day });
        return record;
    };

    const updateDay = async (image: File, dayId: string) => {
        const formData = new FormData();
        formData.append("calendar", calendarId);
        formData.append("image", image);
        const record = await pb.collection("days").update(dayId, formData);
        fetchDay({ id: dayId });
        return record;
    };

    fetchDays();

    return { days, createDay, updateDay };
};