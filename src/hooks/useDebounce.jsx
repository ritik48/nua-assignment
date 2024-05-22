import { useEffect, useState } from "react";

export const useDebounce = (search, delay = 300) => {
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, delay);

        return () => clearTimeout(timeout);
    }, [search, delay]);

    return debouncedSearch;
};
