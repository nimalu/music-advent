export const useDays = (pwd?: string) => {
    const { pb } = usePocketbase();

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
        const days = await pb
            .collection<DayModel>("days")
            .getFullList({ filter: `calendar.id="${toValue(id)}"` });

        const fileToken = await pb.files.getToken();
        calendar.value.days = {};
        for (const d of days) {
            d.url = await getImageUrl(d, fileToken);
            calendar.value.days[d.day] = d;
        }
    }

    async function fetchDay(
        options:
            | { day: string | number; id?: undefined }
            | { id: string; day?: undefined }
    ) {
        let filter = `calendar.id='${toValue(id)}'&&`;
        if (options.day) {
            filter += `day='${options.day}'`;
        } else {
            filter += `id='${options.id}'`;
        }
        const day = await pb
            .collection<DayModel>("days")
            .getFirstListItem(filter);
        const fileToken = await pb.files.getToken();
        day.url = await getImageUrl(day, fileToken);
        calendar.value.days[day.day] = day;
    }
    const createDay = async (image: File, day: number) => {
        const formData = new FormData();
        formData.append("calendar", toValue(id));
        formData.append("image", image);
        formData.append("day", day.toString());
        const record = await pb.collection("days").create(formData);
        fetchDay({ day });
        return record;
    };

    const updateDay = async (image: File, dayId: string) => {
        const formData = new FormData();
        formData.append("calendar", toValue(id));
        formData.append("image", image);
        const record = await pb.collection("days").update(dayId, formData);
        fetchDay({ id: dayId });
        return record;
    };

    return {days, fetchDay}
};
