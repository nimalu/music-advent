import PocketBase from 'pocketbase';

interface CalendarModel {
    id: string
    creator: string
    playlist: string
    recipients: string
    name: string
}

interface DayModel {
    id: string
    calendar: string
    image: string
}

export const useApi = () => {
    const pb = new PocketBase('http://127.0.0.1:8090');

    const login = async (email: string, password: string) => {
        return await pb.collection('users').authWithPassword(email, password);
    }

    const register = async (email: string, password: string, passwordConfirm: string) => {
        await pb.collection("users").create({
            email, password, passwordConfirm
        })
        return await login(email, password)
    }

    const isAuthenticated = () => {
        return pb.authStore.isValid
    }

    const getUserId = () => {
        return pb.authStore.model.id
    }

    const createCalendar = async (name: string) => {
        const record = await pb.collection<CalendarModel>("calendars")
            .create({
                "creator": getUserId(),
                "name": name
            })
        return record
    }

    return { login, register, isAuthenticated, createCalendar }
}

