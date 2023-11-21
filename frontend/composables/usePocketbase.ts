import PocketBase from 'pocketbase';

export const usePocketbase = () => {
    const runtimeConfig = useRuntimeConfig()
    const pb = new PocketBase(runtimeConfig.public.POCKETBASE_URL);
    return { pb }
}

