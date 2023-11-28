import type {
    PlaylistedTrack,
    SimplifiedPlaylist,
} from "@spotify/web-api-ts-sdk";
import type { CalendarModel } from "./useCalendars";
import type Client from "pocketbase";

const calendar = ref<Calendar>({
    id: "",
    password: "",
    user: "",
    playlistItems: [],
});
const loading = ref(false);

export const useCalendar = (id: MaybeRefOrGetter<string>, pwd?: string) => {
    const { pb } = usePocketbase();
    const { sdk } = useSpotify();

    if (pwd) {
        setPwdHeader(pb, pwd);
    }

    async function fetchCalendar() {
        loading.value = true;

        let calendarId = toValue(id);
        const {
            user,
            playlist: playlistId,
            password,
        } = await pb.collection<CalendarModel>("calendars").getOne(calendarId);
        calendar.value.id = calendarId;
        calendar.value.user = user;
        calendar.value.password = password;

        let playlist: SimplifiedPlaylist;
        if (playlistId) {
            playlist = await sdk.playlists.getPlaylist(playlistId);
        } else {
            playlist = (await sdk.currentUser.playlists.playlists(1)).items[0];
        }
        calendar.value.playlist = playlist;
        const itemPage = await sdk.playlists.getPlaylistItems(playlist.id);
        calendar.value.playlistItems = itemPage.items;

        loading.value = false;
    }

    const updateCalendar = async (
        calendar: Partial<CalendarModel> & Pick<CalendarModel, "id">
    ) => {
        loading.value = true;
        await pb.collection("calendars").update(calendar.id, calendar);
        await fetchCalendar();
    };

    async function setPlaylist(
        c: Pick<CalendarModel, "id">,
        playlist: SimplifiedPlaylist
    ) {
        calendar.value.playlist = playlist;
        return updateCalendar({ ...c, playlist: playlist.id });
    }

    const link = computed(() => {
        if (!calendar.value) {
            return undefined;
        }
        const path = window.location.toString() + "/share";
        const url = new URL(path);
        url.searchParams.set("pwd", calendar.value.password);
        return url.toString();
    });

    watch(
        () => toValue(id),
        () => fetchCalendar()
    );
    fetchCalendar();

    return { calendar, setPlaylist, link, loading };
};

export interface DayModel {
    id: string;
    day: string;
    image: string;
    url?: string;
}

interface Calendar {
    id: string;
    password: string;
    user: string;
    playlist?: SimplifiedPlaylist;
    playlistItems: PlaylistedTrack[];
}

function setPwdHeader(pb: Client, password: string) {
    pb.beforeSend = function (_, options) {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers["pwd"] = password;
        return {};
    };
}
