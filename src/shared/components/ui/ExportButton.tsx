'use client';

import React, { useState } from 'react';
import { Download, CheckSquare, Square } from 'lucide-react';

type Column = {
    key: string;
    label: string;
    format?: (value: any) => string;
};

type ExportButtonProps = {
    data: any[];
    columns: Column[];
    fileName: string;
};

export function ExportButton({ data, columns, fileName }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<string[]>(columns.map(c => c.key));

    const toggleColumn = (key: string) => {
        if (selectedKeys.includes(key)) {
            // Prevent deselecting the last column
            if (selectedKeys.length > 1) {
                setSelectedKeys(prev => prev.filter(k => k !== key));
            }
        } else {
            setSelectedKeys(prev => [...prev, key]);
        }
    };

    const getActiveColumns = () => {
        return columns.filter(c => selectedKeys.includes(c.key));
    };

    const exportToCSV = () => {
        setIsOpen(false);
        const activeColumns = getActiveColumns();
        if (data.length === 0 || activeColumns.length === 0) {
            alert('No data or columns to export.');
            return;
        }

        const headers = activeColumns.map(c => `"${c.label}"`).join(',');
        const rows = data.map(item => {
            return activeColumns.map(col => {
                let val = item[col.key];
                if (col.format) val = col.format(val);
                if (val === null || val === undefined) val = '';
                // Escape formatting
                const stringVal = String(val).replace(/"/g, '""');
                return `"${stringVal}"`;
            }).join(',');
        });

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = async () => {
        setIsOpen(false);
        const activeColumns = getActiveColumns();
        if (data.length === 0 || activeColumns.length === 0) {
            alert('No data or columns to export.');
            return;
        }
        setIsExporting(true);

        try {
            // Create a temporary container for the table
            const container = document.createElement('div');
            container.style.padding = '20px';
            container.style.backgroundColor = '#ffffff';
            container.style.color = '#000000';
            container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

            // Title
            const title = document.createElement('h2');
            title.innerText = fileName.replace(/_/g, ' ');
            title.style.marginBottom = '20px';
            title.style.color = '#111827';
            container.appendChild(title);

            // Table
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.fontSize = '12px';

            // Header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            activeColumns.forEach(col => {
                const th = document.createElement('th');
                th.innerText = col.label;
                th.style.border = '1px solid #e5e7eb';
                th.style.padding = '8px';
                th.style.backgroundColor = '#f9fafb';
                th.style.textAlign = 'left';
                th.style.fontWeight = '600';
                th.style.color = '#374151';
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Body
            const tbody = document.createElement('tbody');
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                // Alternate row color
                if (index % 2 === 0) {
                    row.style.backgroundColor = '#ffffff';
                } else {
                    row.style.backgroundColor = '#f9fafb';
                }

                activeColumns.forEach(col => {
                    const td = document.createElement('td');
                    let val = item[col.key];
                    if (col.format) val = col.format(val);
                    if (val === null || val === undefined) val = '';
                    td.innerText = String(val);
                    td.style.border = '1px solid #e5e7eb';
                    td.style.padding = '8px';
                    td.style.color = '#4b5563';
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            container.appendChild(table);

            // We need to temporarily append to document body for html2pdf to work properly if we want layout
            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.top = '-9999px';
            wrapper.style.left = '-9999px';
            wrapper.appendChild(container);
            document.body.appendChild(wrapper);

            const opt = {
                margin: 0.5,
                filename: `${fileName}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' as const }
            };

            const html2pdf = (await import('html2pdf.js')).default;
            await html2pdf().set(opt).from(container).save();
            document.body.removeChild(wrapper);

        } catch (error) {
            console.error('PDF Export failed', error);
            alert('Failed to generate PDF');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'var(--surface-default)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    cursor: isExporting ? 'wait' : 'pointer',
                    fontWeight: 500,
                    fontSize: '14px'
                }}
                disabled={isExporting}
            >
                <Download size={16} />
                {isExporting ? 'Exporting...' : 'Export'}
            </button>

            {isOpen && !isExporting && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    background: 'var(--surface-default)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 50,
                    minWidth: '220px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-sunken)' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Columns to Export
                        </span>
                    </div>

                    <div style={{ padding: '8px 0', maxHeight: '200px', overflowY: 'auto' }}>
                        {columns.map(col => {
                            const isSelected = selectedKeys.includes(col.key);
                            return (
                                <label
                                    key={col.key}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleColumn(col.key)}
                                        style={{ accentColor: 'var(--color-primary)' }}
                                    />
                                    {col.label}
                                </label>
                            );
                        })}
                    </div>

                    <div style={{ borderTop: '1px solid var(--surface-border)', padding: '8px' }}>
                        <button
                            onClick={exportToCSV}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 500
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            Download as CSV / Excel
                        </button>
                        <button
                            onClick={exportToPDF}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '10px 12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 500
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            Download as PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
