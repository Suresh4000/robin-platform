'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Users, Edit } from 'lucide-react';
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

    const openEditModal = (item: Client) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const fetchClients = () => {
        setIsLoading(true);
        fetch('/api/crm/clients')
            .then(res => res.json())
            .then(data => {
                if (data.data) setClients(data.data);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchClients();
    }, []);

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
                <button className={styles.btnPrimary} onClick={openCreateModal}>
                    <Plus size={16} />
                    New Client
                </button>
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
                                        <button
                                            onClick={() => openEditModal(client)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                            title="Edit Client"
                                        >
                                            <Edit size={14} />
                                        </button>
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
