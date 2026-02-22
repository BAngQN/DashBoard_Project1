import { useEffect, useRef, useState } from "react";

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const debouncedValueRef = useRef<number | null>(null);

    useEffect(() => {
        debouncedValueRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            if (debouncedValueRef.current) {
                clearTimeout(debouncedValueRef.current);
            }
        };
    }, [value, delay]);
    return debouncedValue;
};

export default useDebounce;
