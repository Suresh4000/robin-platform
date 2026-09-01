'use client';

import React, { useEffect, useState, useCallback } from 'react';
import styles from './ProjectList.module.css';
import { SlideDrawer } from '@/shared/components/ui/Modal';
import { ProjectForm } from './ProjectForm';

/* ── Inline SVGs ── */
const IcoPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={16} height={16}><path d="M12 5v14M5 12h14" /></svg>;
const IcoEdit = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></svg>;
const IcoBuilding = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>;
const IcoCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><polyline points="20 6 9 17 4 12" /></svg>;
const IcoClock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
const IcoTask = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 12 2 2 4-4" /></svg>;
const IcoChevron = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={16} height={16}><path d="M9 18l6-6-6-6" /></svg>;
const IcoBack = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={16} height={16}><path d="M19 12H5M5 12l7-7M5 12l7 7" /></svg>;
const IcoTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;

type Project = {
    id: string; title: string; status: string;
    client: { name: string; company: string };
    _count: { tasks: number; timeLogs: number };
};
type Task = { id: string; title: string; status: string; dueDate: string | null; };
type TimeEntry = { id: string; description: string; hours: number; isBillable: boolean; date: string; };

const STATUS_COLORS: Record<string, string> = {
    'Planning': '#6366f1',
    'In Progress': '#f59e0b',
    'On Hold': '#94a3b8',
    'Completed': '#22c55e',
    'Cancelled': '#ef4444',
};

/* ─────────────────────────────── PROJECT WORKSPACE DETAIL ─────────────────────────────── */
function ProjectWorkspace({ project, onBack, onProjectUpdated }: { project: Project; onBack: () => void; onProjectUpdated: () => void }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [timeLogs, setTimeLogs] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'tasks' | 'timelogs'>('tasks');

    // Task form state
    const [newTask, setNewTask] = useState('');
    const [taskDue, setTaskDue] = useState('');
    const [addingTask, setAddingTask] = useState(false);

    // Time log form state
    const [logDesc, setLogDesc] = useState('');
    const [logHours, setLogHours] = useState('');
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [logTaskId, setLogTaskId] = useState('');
    const [logBillable, setLogBillable] = useState(true);
    const [addingLog, setAddingLog] = useState(false);

    const fetchDetail = useCallback(() => {
        setLoading(true);
        Promise.all([
            fetch(`/api/ops/tasks?projectId=${project.id}`).then(r => r.json()),
            fetch(`/api/ops/time-entries?projectId=${project.id}`).then(r => r.json()),
        ]).then(([t, tl]) => {
            if (t.data) setTasks(t.data);
            if (tl.data) setTimeLogs(tl.data);
            setLoading(false);
        });
    }, [project.id]);

    useEffect(() => { fetchDetail(); }, [fetchDetail]);

    const toggleTask = async (id: string, current: string) => {
        const next = current === 'Done' ? 'Todo' : 'Done';
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: next } : t));
        await fetch(`/api/ops/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
    };

    const submitTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setAddingTask(true);
        await fetch('/api/ops/tasks', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTask,
                projectId: project.id,
                status: 'Todo',
                dueDate: taskDue ? new Date(taskDue).toISOString() : null
            }),
        });
        setNewTask(''); setTaskDue('');
        setAddingTask(false);
        fetchDetail();
    };

    const deleteTask = async (id: string) => {
        if (!confirm('Delete this task?')) return;
        await fetch(`/api/ops/tasks/${id}`, { method: 'DELETE' });
        fetchDetail();
    };

    const submitLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logDesc.trim() || !logHours) return;
        setAddingLog(true);
        await fetch('/api/ops/time-entries', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: logDesc, hours: parseFloat(logHours), date: new Date(logDate).toISOString(), isBillable: logBillable, projectId: project.id, taskId: logTaskId || null }),
        });
        setLogDesc(''); setLogHours(''); setLogTaskId('');
        setAddingLog(false);
        fetchDetail();
    };

    const deleteLog = async (id: string) => {
        if (!confirm('Delete this time log?')) return;
        await fetch(`/api/ops/time-entries/${id}`, { method: 'DELETE' });
        fetchDetail();
    };

    const totalHours = timeLogs.reduce((s, l) => s + l.hours, 0);
    const billableHours = timeLogs.filter(l => l.isBillable).reduce((s, l) => s + l.hours, 0);
    const doneTasks = tasks.filter(t => t.status === 'Done').length;

    return (
        <div className={styles.workspace}>
            {/* ── Header ── */}
            <div className={styles.wsHeader}>
                <button className={styles.backBtn} onClick={onBack}><IcoBack /> Back to Projects</button>
                <div className={styles.wsTitle}>
                    <h2>{project.title}</h2>
                    <span style={{ fontSize: 13, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <IcoBuilding /> {project.client.name} · <span className={styles.statusPill} style={{ background: STATUS_COLORS[project.status] + '22', color: STATUS_COLORS[project.status], border: `1px solid ${STATUS_COLORS[project.status]}44` }}>{project.status}</span>
                    </span>
                </div>
                {/* Stats */}
                <div className={styles.wsStats}>
                    <div className={styles.wsStat}><span className={styles.wsStatNum}>{doneTasks}/{tasks.length}</span><span>Tasks Done</span></div>
                    <div className={styles.wsStat}><span className={styles.wsStatNum}>{totalHours.toFixed(1)}h</span><span>Total Hours</span></div>
                    <div className={styles.wsStat}><span className={styles.wsStatNum}>{billableHours.toFixed(1)}h</span><span>Billable</span></div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'tasks' ? styles.tabActive : ''}`} onClick={() => setActiveTab('tasks')}><IcoTask /> Tasks <span className={styles.tabCount}>{tasks.length}</span></button>
                <button className={`${styles.tab} ${activeTab === 'timelogs' ? styles.tabActive : ''}`} onClick={() => setActiveTab('timelogs')}><IcoClock /> Time Logs <span className={styles.tabCount}>{timeLogs.length}</span></button>
            </div>

            {loading ? <div className={styles.loading}>Loading…</div> : (
                <>
                    {/* ──────── TASKS TAB ──────── */}
                    {activeTab === 'tasks' && (
                        <div>
                            {/* Add task form */}
                            <form onSubmit={submitTask} className={styles.quickForm}>
                                <input className={styles.qInput} value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add a task…" required />
                                <input type="date" className={styles.qInput} style={{ width: 150 }} value={taskDue} onChange={e => setTaskDue(e.target.value)} />
                                <button type="submit" className={styles.qBtn} disabled={addingTask}>{addingTask ? '…' : <><IcoPlus /> Add Task</>}</button>
                            </form>

                            {tasks.length === 0 ? (
                                <div className={styles.empty}>No tasks yet. Add one above.</div>
                            ) : (
                                <div className={styles.taskList}>
                                    {tasks.map(task => (
                                        <div key={task.id} className={`${styles.taskRow} ${task.status === 'Done' ? styles.taskDone : ''}`}>
                                            <button className={`${styles.cbx} ${task.status === 'Done' ? styles.cbxDone : ''}`} onClick={() => toggleTask(task.id, task.status)} title="Toggle done">
                                                <IcoCheck />
                                            </button>
                                            <span className={styles.taskText}>{task.title}</span>
                                            {task.dueDate && <span className={styles.dueChip}>{new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
                                            <span className={`${styles.taskStatus} ${task.status === 'Done' ? styles.taskStatusDone : task.status === 'In Progress' ? styles.taskStatusWip : ''}`}>{task.status}</span>
                                            <button className={styles.delBtn} onClick={() => deleteTask(task.id)} title="Delete"><IcoTrash /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ──────── TIME LOGS TAB ──────── */}
                    {activeTab === 'timelogs' && (
                        <div>
                            {/* Add time log form */}
                            <form onSubmit={submitLog} className={styles.quickForm} style={{ flexWrap: 'wrap' }}>
                                <select className={styles.qInput} style={{ flex: 1, minWidth: 140 }} value={logTaskId} onChange={e => {
                                    setLogTaskId(e.target.value);
                                    const t = tasks.find(x => x.id === e.target.value);
                                    if (t && !logDesc) setLogDesc(t.title);
                                }}>
                                    <option value="">General (No Task)</option>
                                    {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                                <input className={styles.qInput} style={{ flex: 2, minWidth: 180 }} value={logDesc} onChange={e => setLogDesc(e.target.value)} placeholder="Description of work…" required />
                                <input type="number" className={styles.qInput} style={{ width: 90 }} min="0.25" step="0.25" value={logHours} onChange={e => setLogHours(e.target.value)} placeholder="Hours" required />
                                <input type="date" className={styles.qInput} style={{ width: 150 }} value={logDate} onChange={e => setLogDate(e.target.value)} required />
                                <label className={styles.billableToggle}>
                                    <input type="checkbox" checked={logBillable} onChange={e => setLogBillable(e.target.checked)} /> Billable
                                </label>
                                <button type="submit" className={styles.qBtn} disabled={addingLog}>{addingLog ? '…' : <><IcoPlus /> Log Time</>}</button>
                            </form>

                            {timeLogs.length === 0 ? (
                                <div className={styles.empty}>No time logged yet.</div>
                            ) : (
                                <div className={styles.logList}>
                                    <div className={styles.logHeader}>
                                        <span>Description</span><span>Date</span><span>Hours</span><span>Billable</span><span></span>
                                    </div>
                                    {timeLogs.map(log => (
                                        <div key={log.id} className={styles.logRow}>
                                            <span>{log.description}</span>
                                            <span>{new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                            <span><b>{log.hours}h</b></span>
                                            <span>{log.isBillable ? <span className={styles.billYes}>✓ Yes</span> : <span className={styles.billNo}>No</span>}</span>
                                            <button className={styles.delBtn} onClick={() => deleteLog(log.id)} title="Delete"><IcoTrash /></button>
                                        </div>
                                    ))}
                                    <div className={styles.logFooter}>
                                        <span>Total: <b>{totalHours.toFixed(2)}h</b></span>
                                        <span>Billable: <b>{billableHours.toFixed(2)}h</b></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

/* ─────────────────────────────── PROJECT LIST ─────────────────────────────── */
export function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Project | null>(null);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [showDeleted, setShowDeleted] = useState(false);

    const fetchProjects = useCallback((deleted = false) => {
        setIsLoading(true);
        fetch(`/api/ops/projects?isDeleted=${deleted}`).then(r => r.json()).then(data => {
            if (data.data) setProjects(data.data);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => { fetchProjects(showDeleted); }, [fetchProjects, showDeleted]);

    const openEdit = (p: Project, e: React.MouseEvent) => { e.stopPropagation(); setEditingItem(p); setIsModalOpen(true); };
    const openCreate = () => { setEditingItem(null); setIsModalOpen(true); };

    const deleteProject = async (p: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Move project "${p.title}" to trash?`)) return;
        setProjects(prev => prev.filter(proj => proj.id !== p.id));
        await fetch(`/api/ops/projects/${p.id}`, { method: 'DELETE' });
    };

    const restoreProject = async (p: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        setProjects(prev => prev.filter(proj => proj.id !== p.id));
        await fetch(`/api/ops/projects/${p.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: false })
        });
    };

    if (activeProject) {
        return <ProjectWorkspace project={activeProject} onBack={() => { setActiveProject(null); fetchProjects(); }} onProjectUpdated={fetchProjects} />;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Project Workspaces</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Click any project to manage tasks and time logs</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className={styles.btnPrimary}
                        style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)', border: '1px solid var(--surface-border)' }}
                        onClick={() => setShowDeleted(!showDeleted)}
                    >
                        {showDeleted ? 'Active Projects' : 'Trash'}
                    </button>
                    <button className={styles.btnPrimary} onClick={openCreate}><IcoPlus /> New Project</button>
                </div>
            </header>

            {isLoading ? (
                <div className={styles.loading}>Loading…</div>
            ) : projects.length === 0 ? (
                <div className={styles.empty}>No projects yet. Click "New Project" to start one.</div>
            ) : (
                <div className={styles.grid}>
                    {projects.map(project => (
                        <div key={project.id} className={styles.card} onClick={() => setActiveProject(project)} style={{ cursor: 'pointer' }}>
                            <div className={styles.cardHeader}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 className={styles.cardTitle}>{project.title}</h3>
                                    <div className={styles.cardClient}><IcoBuilding /> {project.client.name} · {project.client.company}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                    <span className={styles.statusBadge} style={{ background: STATUS_COLORS[project.status] + '22', color: STATUS_COLORS[project.status], border: `1px solid ${STATUS_COLORS[project.status]}44` }}>
                                        {project.status}
                                    </span>
                                    {!showDeleted && <button onClick={(e) => openEdit(project, e)} className={styles.editBtn} title="Edit"><IcoEdit /></button>}
                                    {showDeleted ? (
                                        <button onClick={(e) => restoreProject(project, e)} className={styles.editBtn} style={{ color: '#3b82f6' }} title="Restore"><IcoBack /></button>
                                    ) : (
                                        <button onClick={(e) => deleteProject(project, e)} className={styles.editBtn} style={{ color: '#ef4444' }} title="Trash"><IcoTrash /></button>
                                    )}
                                </div>
                            </div>
                            <div className={styles.cardMetrics}>
                                <div className={styles.metric}><IcoTask /> <b>{project._count.tasks}</b> Tasks</div>
                                <div className={styles.metric}><IcoClock /> <b>{project._count.timeLogs}</b> Time Logs</div>
                            </div>
                            <div className={styles.cardOpenHint}><IcoChevron /></div>
                        </div>
                    ))}
                </div>
            )}

            <SlideDrawer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Project Hub' : 'Initialize New Project Hub'}>
                <ProjectForm initialData={editingItem} onSuccess={() => { setIsModalOpen(false); fetchProjects(); }} />
            </SlideDrawer>
        </div>
    );
}
