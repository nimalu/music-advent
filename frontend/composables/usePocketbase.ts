import PocketBase from 'pocketbase';

export const usePocketBase = () => {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const login = async (email: string, password: string) => {
        return await pb.collection('users').authWithPassword(email, password);
    }

    const register = async (username: string, password: string) => {
        await pb.collection("users").create({
            username, password, passwordConfirm: password
        })
        return await login(username, password)
    }

    const isAuthenticated = () => {
        return pb.authStore.isValid
    }

    const getUserId = () => {
        return pb.authStore.model.id
    }
    return { pb, login, register, isAuthenticated, getUserId }
}
