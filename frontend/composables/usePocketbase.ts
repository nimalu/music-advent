import PocketBase from 'pocketbase';

export const usePocketBase = () => {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const login = async (email: string, password: string) => {
        await pb.collection('users').authWithPassword(email, password);
        updateAuthenticated()
    }

    const logout = () => {
        pb.authStore.clear()
        updateAuthenticated()
    }

    const register = async (email: string, password: string) => {
        await pb.collection("users").create({
            email, password, passwordConfirm: password
        })
        await login(email, password)
        updateAuthenticated()
    }

    const isAuthenticated = ref(false)
    const updateAuthenticated = () => {
        isAuthenticated.value = pb.authStore.isValid
    }

    const userId = computed(() => {
        if (isAuthenticated) {
            return pb.authStore.model?.id 
        } else {
            return null
        }
    })

    updateAuthenticated()
    return { pb, login, register, isAuthenticated, userId, logout }
}
