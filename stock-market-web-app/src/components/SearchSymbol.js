import React from "react";

export default function SearchSymbol({ onChange, value }) {
    return (
        <div>
            <input
                name="search"
                id="search"
                type="search"
                onChange={(e) => onChange(e.target.value)}
                value={value.toUpperCase()}
                placeholder="Symbol..."
            />
        </div>
    );
}
