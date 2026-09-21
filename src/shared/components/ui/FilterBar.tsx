import React from 'react';
import { Search } from 'lucide-react';

export type DropdownFilter = {
    key: string;
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
};

type FilterBarProps = {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    searchPlaceholder?: string;
    dropdowns?: DropdownFilter[];
};

export function FilterBar({
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search...",
    dropdowns = []
}: FilterBarProps) {
    return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        borderRadius: '8px',
                        border: '1px solid var(--surface-border)',
                        background: 'var(--surface-default)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Dropdown Filters */}
            {dropdowns.map(dropdown => (
                <div key={dropdown.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {dropdown.label && (
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {dropdown.label}:
                        </span>
                    )}
                    <select
                        value={dropdown.value}
                        onChange={(e) => dropdown.onChange(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--surface-border)',
                            background: 'var(--surface-default)',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer',
                            minWidth: '160px'
                        }}
                    >
                        {dropdown.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}
