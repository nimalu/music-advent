<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        disabled: boolean;
    }>(),
    { disabled: false }
);
const emit = defineEmits(["unlock", "change"]);

const handleContainer = ref<HTMLDivElement>();
const handle = ref<HTMLDivElement>();
const left = ref(0);

const startDragX = ref(0);
const dragging = ref(false);
let mouseMoveListener: (e: MouseEvent) => void,
    touchMoveListener: (e: TouchEvent) => void;
function removeListeners() {
    window.removeEventListener("mousemove", mouseMoveListener);
    window.removeEventListener("touchmove", touchMoveListener);
    window.removeEventListener("mouseup", removeListeners);
    window.removeEventListener("touchend", removeListeners);
    left.value = 0;
}
function handleDrag(e: MouseEvent) {
    e.preventDefault();
    if (props.disabled) {
        return;
    }
    dragging.value = true;
    startDragX.value = e.x;
    const maxValue =
        (handleContainer.value?.offsetWidth ?? 0) -
        (handle.value?.offsetWidth ?? 0);
    mouseMoveListener = (e) => {
        const s = Math.max(0, e.x - startDragX.value);
        const progress = s / maxValue;
        emit("change", progress);
        if (progress >= 1.0) {
            removeListeners();
            emit("unlock");
        }
        left.value = Math.min(s, maxValue);
    };
    window.addEventListener("mousemove", mouseMoveListener);
    window.addEventListener("mouseup", removeListeners);
}
function handleDragTouch(e: TouchEvent) {
    e.preventDefault();
    if (props.disabled) {
        return;
    }
    const x = e.changedTouches[0].screenX;
    dragging.value = true;
    startDragX.value = x;
    const maxValue =
        (handleContainer.value?.offsetWidth ?? 0) -
        (handle.value?.offsetWidth ?? 0);
    touchMoveListener = (e) => {
        const x = e.changedTouches[0].screenX;
        const s = Math.max(0, x - startDragX.value);
        const progress = s / maxValue;
        emit("change", progress);
        if (progress >= 1.0) {
            removeListeners();
            emit("unlock");
        }
        left.value = Math.min(s, maxValue);
    };
    window.addEventListener("touchmove", touchMoveListener);
    window.addEventListener("touchend", removeListeners);
}
</script>

<template>
    <div class="slider" :class="{ disabled }">
        <div class="handle-container" ref="handleContainer">
            <div
                @mousedown="handleDrag"
                @touchstart="handleDragTouch"
                ref="handle"
                class="handle"
                :style="`left: ${left}px;`"
            ></div>
        </div>
    </div>
</template>

<style scoped>
.slider {
    --slider-height: 3rem;
    --slider-width: 7rem;
    --handle-size: 2.5rem;
    background-color: white;
    height: var(--slider-height);
    width: var(--slider-width);
    border-radius: 2.5rem;
    padding: 0.25rem;
}
.slider.disabled {
    background-color: #DDD;
}
.handle-container {
    position: relative;
}
.handle {
    background-color: #333;
    height: var(--handle-size);
    width: var(--handle-size);
    border-radius: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
.slider.disabled >>> .handle {
    background-color: #AAA;
}
</style>
