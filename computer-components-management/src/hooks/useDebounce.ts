import { useEffect, useRef, useState } from "react";

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        timeRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            if (timeRef.current != null) {
                clearTimeout(timeRef.current);
            }
        };
    }, [value, delay]);
    return debouncedValue;
};

export default useDebounce;
