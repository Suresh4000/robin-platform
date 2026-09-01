import React, { useRef } from 'react';
import { Download } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export function InvoicePrintView({ invoice, onClose }: { invoice: any, onClose: () => void }) {
    const printRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = () => {
        const element = printRef.current;
        if (!element) return;

        const opt = {
            margin: 0.5,
            filename: `Invoice_${invoice.id.substring(0, 6).toUpperCase()}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--surface-border)' }}>
                <button
                    onClick={handleDownloadPDF}
                    style={{ background: 'var(--color-primary)', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Download size={16} />
                    Download PDF
                </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '20px', background: '#ffffff', color: '#000000' }}>
                <div ref={printRef} style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div>
                            <h1 style={{ fontSize: '32px', margin: 0, color: '#111827' }}>INVOICE</h1>
                            <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>#{invoice.id.substring(0, 6).toUpperCase()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ fontSize: '20px', margin: 0, color: '#111827' }}>Robin Agency</h2>
                            <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>hello@robin.agency<br />123 Innovation Drive<br />Tech City, CA 90210</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div>
                            <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>BILL TO:</p>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>{invoice.client.name}</h3>
                            <p style={{ color: '#4b5563', margin: '4px 0 0 0', fontSize: '14px' }}>{invoice.client.company}</p>
                            {invoice.client.email && <p style={{ color: '#4b5563', margin: '4px 0 0 0', fontSize: '14px' }}>{invoice.client.email}</p>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><span style={{ color: '#6b7280' }}>Issue Date:</span> <span style={{ fontWeight: 500 }}>{new Date(invoice.createdAt).toLocaleDateString()}</span></p>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><span style={{ color: '#6b7280' }}>Due Date:</span> <span style={{ fontWeight: 500 }}>{new Date(invoice.dueDate).toLocaleDateString()}</span></p>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#374151', fontSize: '14px' }}>Description & Project</th>
                                <th style={{ textAlign: 'right', padding: '12px 8px', color: '#374151', fontSize: '14px' }}>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.timeEntries?.map((entry: any) => (
                                <tr key={entry.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '16px 8px' }}>
                                        <div style={{ fontWeight: 500, color: '#111827', fontSize: '15px' }}>{entry.description}</div>
                                        <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>{entry.project?.title || 'General Work'} • {new Date(entry.date).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 500, color: '#374151' }}>
                                        {entry.hours} h
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #e5e7eb', paddingTop: '16px' }}>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#4b5563' }}>
                                <span>Total Hours</span>
                                <span>{invoice.timeEntries?.reduce((sum: number, e: any) => sum + e.hours, 0) || 0} h</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 'bold', color: '#111827', fontSize: '16px' }}>Total Due</span>
                                <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '24px' }}>${invoice.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '60px', color: '#6b7280', fontSize: '13px', textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                        Thank you for your business. Payment is due by {new Date(invoice.dueDate).toLocaleDateString()}.
                    </div>
                </div>
            </div>
        </div>
    );
}
