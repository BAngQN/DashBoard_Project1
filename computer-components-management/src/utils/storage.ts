const STORAGE_KEYS = {
    currentPage: "products.currentPage",
    totalPages: "products.totalPages",
} as const;

const getNumber = (key: string, fallback: number) => {
    const rawValue = localStorage.getItem(key);
    const parsedValue = rawValue ? parseInt(rawValue, 10) : fallback;

    return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

const setNumber = (key: string, value: number) => {
    localStorage.setItem(key, value.toString());
};

export const storage = {
    getCurrentPage: () => getNumber(STORAGE_KEYS.currentPage, 1),
    setCurrentPage: (value: number) =>
        setNumber(STORAGE_KEYS.currentPage, value),
    getTotalPages: () => getNumber(STORAGE_KEYS.totalPages, 0),
    setTotalPages: (value: number) => setNumber(STORAGE_KEYS.totalPages, value),
};
