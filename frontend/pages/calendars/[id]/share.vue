<script lang="ts" setup>
definePageMeta({ middleware: ["auth"], layout: "info" });
const route = useRoute();
const calendarId = route.params.id as string;
const password = (() => {
    if ("pwd" in route.query) {
        return route.query["pwd"] as string;
    } else {
        return "---";
    }
})();
const today = new Date().getDate();
const preview = "preview" in route.query
const locked = new Date().getMonth() == 10

const { calendar } = useCalendar(calendarId, password);

const { playTrack } = usePlayer();

const { days } = useDays(calendarId, password);

const activeDay = ref<number>(-1);
function revealDay(door: number) {
    if (today < door) {
        return;
    }
    activeDay.value = door;
    if (calendar.value.playlist) {
        playTrack(calendar.value.playlist, door - 1);
    }
}
</script>

<template>
    <div class="media-scroller snaps-inline">
        <div class="media-element" v-for="(day, index) in days" :key="index">
            <button class="card" @click="() => revealDay(index + 1)">
                <img
                    v-if="day.content && (today > index && !locked || preview)"
                    :src="day.content?.url"
                    alt=""
                />
                <div
                    class="overlay"
                    :class="{
                        revealed: index + 1 == activeDay,
                        locked: (index + 1 > today || locked) && !preview,
                    }"
                >
                    {{ index + 1 }}
                </div>
            </button>
            <div class="track" v-if="day.track && (today > index && !locked || preview)">
                {{ day.track.name }}
            </div>
        </div>
    </div>
</template>

<style>
:root {
    --shadow-color: 257deg 35% 80%;
    --shadow-elevation-low: 1px 1px 1.6px hsl(var(--shadow-color) / 0.24),
        1.5px 1.5px 2.4px -1.3px hsl(var(--shadow-color) / 0.24),
        3.3px 3.4px 5.3px -2.5px hsl(var(--shadow-color) / 0.23);
    --shadow-elevation-medium: 1px 1px 1.6px hsl(var(--shadow-color) / 0.25),
        2.8px 2.9px 4.5px -0.8px hsl(var(--shadow-color) / 0.25),
        6.9px 7px 11px -1.7px hsl(var(--shadow-color) / 0.25),
        16.7px 16.9px 26.6px -2.5px hsl(var(--shadow-color) / 0.24);
    --shadow-elevation-high: 1px 1px 1.6px hsl(var(--shadow-color) / 0.23),
        4.2px 4.3px 6.7px -0.4px hsl(var(--shadow-color) / 0.23),
        7.6px 7.7px 12.1px -0.7px hsl(var(--shadow-color) / 0.23),
        12.3px 12.5px 19.6px -1.1px hsl(var(--shadow-color) / 0.23),
        19.5px 19.8px 31.1px -1.5px hsl(var(--shadow-color) / 0.23),
        30.5px 30.9px 48.5px -1.8px hsl(var(--shadow-color) / 0.23),
        46.3px 46.9px 73.6px -2.2px hsl(var(--shadow-color) / 0.23),
        68.1px 69px 108.3px -2.5px hsl(var(--shadow-color) / 0.22);
}

.media-scroller {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 90%;
    gap: 1.8rem;
    overscroll-behavior-inline: contain;
    padding: 0rem 5%;
    margin-top: 2.5rem;
    overflow-x: scroll;
}

.media-element > .card {
    height: 70dvh;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow-elevation-medium);
    position: relative;
}

.card > .overlay {
    position: absolute;
    inset: 0 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(240, 240, 240, 0.9);
    font-size: 2rem;
    font-weight: bold;
    transition: opacity 0.2s;
}

.card > .overlay.revealed {
    opacity: 0;
}

.card > .overlay.locked {
    color: #888;

}

.card > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.snaps-inline {
    scroll-snap-type: inline mandatory;
}

.snaps-inline > * {
    scroll-snap-align: center;
}

.track {
    width: 100%;
    text-align: center;
    padding: 1rem 1rem;
    font-size: 1.2rem;
}
</style>
