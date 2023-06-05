export const getImageUrl = (path = "") => {
    return import.meta.env.VITE_BASE_URL + path;
}