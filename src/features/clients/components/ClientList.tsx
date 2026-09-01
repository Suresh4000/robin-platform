'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Users, Edit, Trash2, RefreshCw } from 'lucide-react';
import styles from './ClientList.module.css';
import { SlideDrawer } from '@/shared/components/ui/Modal';
import { ClientForm } from './ClientForm';

type Client = {
    id: string;
    name: string;
    company: string;
    email: string | null;
    status: string;
};

export function ClientList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Client | null>(null);
    const [showDeleted, setShowDeleted] = useState(false);

    const openEditModal = (item: Client) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const fetchClients = (deleted = false) => {
        setIsLoading(true);
        fetch(`/api/crm/clients?isDeleted=${deleted}`)
            .then(res => res.json())
            .then(data => {
                if (data.data) setClients(data.data);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchClients(showDeleted);
    }, [showDeleted]);

    const deleteClient = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to move "${name}" to trash?`)) return;
        try {
            await fetch(`/api/crm/clients/${id}`, { method: 'DELETE' });
            fetchClients(showDeleted);
        } catch (e) {
            console.error(e);
        }
    };

    const restoreClient = async (id: string) => {
        try {
            await fetch(`/api/crm/clients/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDeleted: false })
            });
            fetchClients(showDeleted);
        } catch (e) {
            console.error(e);
        }
    };

    const getStatusClass = (status: string) => {
        if (status === 'Active') return styles.statusActive;
        if (status === 'On Hold') return styles.statusHold;
        return styles.statusCompleted;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Client Workspace</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage active engagements and history
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className={styles.btnPrimary}
                        style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                        onClick={() => setShowDeleted(!showDeleted)}
                    >
                        {showDeleted ? 'Active Clients' : 'Trash'}
                    </button>
                    <button className={styles.btnPrimary} onClick={openCreateModal}>
                        <Plus size={16} />
                        New Client
                    </button>
                </div>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Loading records...</td></tr>
                        ) : clients.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No clients found.</td></tr>
                        ) : (
                            clients.map(client => (
                                <tr key={client.id}>
                                    <td>
                                        <div className={styles.clientName}>
                                            <Users size={16} style={{ color: 'var(--color-primary)' }} />
                                            {client.name}
                                        </div>
                                    </td>
                                    <td>{client.company}</td>
                                    <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px' }}>
                                        {client.email || '-'}
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${getStatusClass(client.status)}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {!showDeleted && (
                                                <button
                                                    onClick={() => openEditModal(client)}
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                                    title="Edit Client"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                            )}
                                            {showDeleted ? (
                                                <button
                                                    onClick={() => restoreClient(client.id)}
                                                    style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', padding: '4px' }}
                                                    title="Restore"
                                                >
                                                    <RefreshCw size={14} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => deleteClient(client.id, client.name)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                    title="Trash"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <SlideDrawer
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit Client Profile" : "Onboard New Client"}
            >
                <ClientForm
                    initialData={editingItem}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchClients();
                    }}
                />
            </SlideDrawer>
        </div>
    );
}
