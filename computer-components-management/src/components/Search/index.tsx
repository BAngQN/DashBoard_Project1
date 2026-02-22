import "./index.css";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";

interface SearchProps {
    onSearch?: (term: string) => void;
    placeholder?: string;
}

function Search({ onSearch, placeholder = "Search products..." }: SearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const debounceSearchTerm = useDebounce(searchTerm, 500);
    const isSearching = searchTerm !== debounceSearchTerm;

    useEffect(() => {
        if (debounceSearchTerm !== undefined) {
            if (onSearch) {
                onSearch(debounceSearchTerm);
            }
        }
    }, [debounceSearchTerm, onSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm("");
        if (onSearch) {
            onSearch("");
        }
    };

    return (
        <div className="search-container">
            <div className="search-wrapper">
                <svg
                    className="search-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    id="search"
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                {searchTerm && !isSearching && (
                    <button
                        className="search-clear"
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
                {isSearching && <div className="search-loading" />}
            </div>
        </div>
    );
}

export default Search;
