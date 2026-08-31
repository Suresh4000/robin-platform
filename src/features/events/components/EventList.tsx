'use client';

import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Clock, Users, Calendar, Edit, Trash2, Globe } from 'lucide-react';
import styles from './EventList.module.css';
import { SlideDrawer } from '@/shared/components/ui/Modal';
import { EventForm } from './EventForm';
import { AttendeesList } from './AttendeesList';

type EventData = {
    id: string;
    title: string;
    type: string;
    date: string;
    duration: number;
    location: string;
    capacity: number;
    status: string;
    _count: { attendees: number };
};

export function EventList() {
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EventData | null>(null);
    const [viewingAttendeesId, setViewingAttendeesId] = useState<string | null>(null);

    const openEditModal = (item: EventData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const fetchEvents = () => {
        setIsLoading(true);
        fetch('/api/ops/events')
            .then(res => res.json())
            .then(data => {
                if (data.data) setEvents(data.data);
                setIsLoading(false);
            });
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
        try {
            const res = await fetch(`/api/ops/events/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchEvents();
            } else {
                alert('Failed to delete event.');
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Event Management</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Workshops, Webinars, and Conferences
                    </p>
                </div>
                <button className={styles.btnPrimary} onClick={openCreateModal}>
                    <Plus size={16} />
                    New Event
                </button>
            </header>

            {isLoading ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading records...</div>
            ) : events.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--surface-border)', borderRadius: '8px' }}>
                    No upcoming events.
                </div>
            ) : (
                <div className={styles.grid}>
                    {events.map(event => {
                        const dateObj = new Date(event.date);
                        const month = dateObj.toLocaleString('default', { month: 'short' });
                        const day = dateObj.getDate();
                        const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div key={event.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div className={styles.cardDate}>
                                            <span className={styles.month}>{month}</span>
                                            <span className={styles.day}>{day}</span>
                                        </div>
                                        <div>
                                            <h3 className={styles.cardTitle}>{event.title}</h3>
                                            <div className={styles.cardType}>
                                                <Calendar size={14} />
                                                {event.type}
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => openEditModal(event)}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', marginLeft: '8px' }}
                                                title="Edit Event"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id, event.title)}
                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', marginLeft: '4px' }}
                                                title="Delete Event"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <a
                                                href={`/events/${event.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', marginLeft: '4px', display: 'inline-flex', alignItems: 'center' }}
                                                title="View Public Event Page"
                                            >
                                                <Globe size={14} />
                                            </a>
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${event.status === 'Published' ? styles.statusPublished : ''}`}>
                                        {event.status}
                                    </span>
                                </div>

                                <div className={styles.details}>
                                    <div className={styles.detailRow}>
                                        <Clock size={14} />
                                        {time} ({event.duration} mins)
                                    </div>
                                    <div className={styles.detailRow}>
                                        <MapPin size={14} />
                                        {event.location}
                                    </div>
                                </div>

                                <div className={styles.metrics}>
                                    <div
                                        className={styles.metric}
                                        style={{ cursor: 'pointer', color: 'var(--accent)' }}
                                        onClick={() => setViewingAttendeesId(event.id)}
                                        title="View Attendees"
                                    >
                                        <Users size={14} />
                                        <b style={{ textDecoration: 'underline' }}>{event._count.attendees} Registered</b> / {event.capacity} Capacity
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <SlideDrawer
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit Event" : "Schedule New Event"}
            >
                <EventForm
                    initialData={editingItem}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchEvents();
                    }}
                />
            </SlideDrawer>

            <SlideDrawer
                isOpen={!!viewingAttendeesId}
                onClose={() => setViewingAttendeesId(null)}
                title="Event Attendees"
            >
                {viewingAttendeesId && <AttendeesList eventId={viewingAttendeesId} />}
            </SlideDrawer>
        </div>
    );
}
