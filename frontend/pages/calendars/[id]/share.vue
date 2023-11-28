<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] });
const route = useRoute();
const calendarId = route.params.id as string;
const password = computed(() => {
    if ("pwd" in route.query) {
        return route.query["pwd"];
    } else {
        return "---";
    }
});

const { calendar } = useCalendar(calendarId);

const { playTrack } = usePlayer();

const { days } = useDays(calendarId);
</script>

<template>
    <div class="calendar">
        <Door :door="3" :rows="3" :cols="1" />
        <Door :door="11" :rows="2" :cols="2" />
        <Door :door="4" :rows="2" :cols="1" />
        <Door :door="5" :rows="1" :cols="2" />
        <Door :door="8" :rows="3" :cols="1" />
        <Door :door="10" :rows="1" :cols="1" />
        <Door :door="2" :rows="2" :cols="1" />
        <Door :door="12" :rows="1" :cols="2" />
        <Door :door="23" :rows="1" :cols="1" />
        <Door :door="15" :rows="1" :cols="1" />
        <Door :door="1" :rows="3" :cols="2" />
        <Door :door="13" :rows="1" :cols="2" />
        <Door :door="14" :rows="1" :cols="1" />
        <Door :door="7" :rows="2" :cols="2" />
        <Door :door="9" :rows="1" :cols="1" />
        <Door :door="16" :rows="2" :cols="1" />
        <Door :door="24" :rows="2" :cols="3" />
        <Door :door="17" :rows="1" :cols="2" />
        <Door :door="6" :rows="1" :cols="1" />
        <Door :door="19" :rows="1" :cols="1" />
        <Door :door="20" :rows="3" :cols="2" />
        <Door :door="21" :rows="2" :cols="1" />
        <Door :door="18" :rows="2" :cols="1" />
        <Door :door="22" :rows="1" :cols="3" />
    </div>
</template>

<style>
.calendar {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: 8px;
}
</style>
