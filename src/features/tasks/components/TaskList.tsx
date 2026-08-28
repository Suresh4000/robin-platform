'use client';

import React, { useEffect, useState } from 'react';
import styles from './TaskList.module.css';

const IcoCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><polyline points="20 6 9 17 4 12" /></svg>;
const IcoPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={16} height={16}><path d="M12 5v14M5 12h14" /></svg>;

type Task = {
    id: string;
    title: string;
    status: string;
    dueDate: string | null;
    project: { title: string; client: { name: string } };
};

export function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/ops/tasks')
            .then(res => res.json())
            .then(data => {
                if (data.data) setTasks(data.data);
                setIsLoading(false);
            });
    }, []);

    const toggleTaskStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Done' ? 'Todo' : 'Done';
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
        await fetch(`/api/ops/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
    };

    const formatDate = (isoStr: string | null) => {
        if (!isoStr) return 'No due date';
        return new Date(isoStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Task Management</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Unified operational to-do list across all projects
                    </p>
                </div>
                <button className={styles.btnPrimary}>
                    <IcoPlus />
                    New Task
                </button>
            </header>

            {isLoading ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--surface-border)', borderRadius: '8px' }}>
                    No active tasks. Add tasks from inside a Project Workspace.
                </div>
            ) : (
                <div className={styles.listWrapper}>
                    {tasks.map(task => {
                        const isDone = task.status === 'Done';
                        return (
                            <div key={task.id} className={styles.taskItem}>
                                <div className={styles.taskLeft}>
                                    <div
                                        className={`${styles.checkbox} ${isDone ? styles.done : ''}`}
                                        onClick={() => toggleTaskStatus(task.id, task.status)}
                                    >
                                        <IcoCheck />
                                    </div>

                                    <div className={styles.taskDetails}>
                                        <div className={styles.taskTitle} style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'inherit' }}>
                                            {task.title}
                                        </div>
                                        <div className={styles.taskContext}>
                                            <span className={styles.badge}>{task.project.client.name}</span>
                                            <span>•</span>
                                            <span>{task.project.title}</span>
                                            {!isDone && task.status === 'In Progress' && (
                                                <span className={`${styles.badge} ${styles.statusInProgress}`}>In Progress</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.taskRight}>
                                    <span className={styles.dueDate}>{formatDate(task.dueDate)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
