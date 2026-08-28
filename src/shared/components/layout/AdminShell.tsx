'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import topbarStyles from './MobileTopbar.module.css';
import styles from './AdminShell.module.css';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.adminMain}>
        {/* Mobile Topbar */}
        <header className={topbarStyles.topbar}>
          <button className={topbarStyles.hamburger} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className={topbarStyles.brandText}>Robin</div>
        </header>

        {/* Main Content Pane */}
        <main className={styles.contentPadding}>
          {children}
        </main>
      </div>
    </div>
  );
}
