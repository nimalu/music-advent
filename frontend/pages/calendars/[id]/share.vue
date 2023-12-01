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
const preview = "preview" in route.query;
const today = preview ? 30 : new Date().getDate();

const { calendar } = useCalendar(calendarId, password);

const { playTrack } = usePlayer();

const { days } = useDays(calendarId, password);

const activeDay = ref<number>(today - 1);
const dayRevealed = ref(false);

function revealDay() {
    dayRevealed.value = true;
    if (!calendar.value.playlist) {
        return
    }
    playTrack(calendar.value.playlist, activeDay.value)
}

function openDay(day: number) {
    if (day == activeDay.value) {
        return;
    }
    dayRevealed.value = false;
    activeDay.value = day;
}

function handleSlideClick(e: MouseEvent) {
    const imgElement = e.target as HTMLImageElement;
    const x = e.x - imgElement.x;
    if (x < imgElement.width / 3) {
        openDay(Math.max(0, activeDay.value - 1));
    } else if (x > (imgElement.width / 3) * 2) {
        openDay(Math.min(days.value.length - 1, activeDay.value + 1));
    }
}
</script>

<template>
    <div class="container">
        <ul class="slides">
            <li
                v-for="(day, index) in days"
                :key="index"
                :class="{ active: index == activeDay }"
            ></li>
        </ul>
        <div class="door">
            <img
                v-for="(day, index) in days"
                :key="index"
                :src="day.content?.url"
                :class="{ hidden: index != activeDay || !dayRevealed }"
                @click="handleSlideClick"
            />
            <div class="door-label">
                {{ activeDay + 1 }}
            </div>
            <Lock
                :disabled="today - 1 < activeDay"
                v-if="!dayRevealed"
                @unlock="revealDay"
            />
        </div>
        <div class="player">
            <p class="title" v-if="dayRevealed">{{ days[activeDay].track?.name }}</p>
            <p class="artists" v-if="dayRevealed">{{ days[activeDay].track?.artists.map(a => a.name).join(", ") }}</p>
        </div>
    </div>
</template>

<style scoped>
.hidden {
    opacity: 0;
}
.container {
    background-color: #111;
    width: 100%;
    height: 100%;
    padding: 16px;
    color: white;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
}


.slides {
    display: flex;
    list-style-type: none;
    column-gap: 3px;
}

.slides > * {
    background-color: #444;
    height: 6px;
    flex-grow: 1;
    border-radius: 2px;
}

.slides > .active {
    background-color: #ccc;
}

.door {
    --christmas: #ab1443;
    width: 100%;
    font-weight: bold;
    font-size: 3rem;
    background-color: var(--christmas);
    border-radius: 8px;
    overflow: hidden;
    flex-grow: 1;
    display: flex;
    row-gap: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}

.door > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.door-label {
    user-select: none;
    background-color: white;
    width: 6rem;
    height: 6rem;
    border-radius: 100%;
    color: var(--christmas);
    display: flex;
    align-items: center;
    justify-content: center;
}

.player {
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #222;
    padding: 8px 12px;
    border-radius: 8px;
}

.player > .title {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.05rem;
}

.player > .artists {
    font-weight: 300;
}
</style>
