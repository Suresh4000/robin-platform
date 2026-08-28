'use client';
import { useEffect } from 'react';

export function RevealHook() {
  useEffect(() => {
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      
      const handleAccordionClick = (e) => {
        const target = e.target.closest('.tl-toggle');
        if (!target) return;
        const entry = target.closest('.tl-entry');
        if (entry) {
          const isO = entry.classList.contains('is-open');
          const accordion = entry.closest('.tl-accordion');
          if (accordion) {
            accordion.querySelectorAll('.tl-entry').forEach(el => {
              el.classList.remove('is-open');
              const toggle = el.querySelector('.tl-toggle');
              if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
          }
          if (!isO) {
            entry.classList.add('is-open');
            target.setAttribute('aria-expanded', 'true');
          }
        }
      };

      document.querySelectorAll('.tl-accordion').forEach(acc => {
         acc.removeEventListener('click', handleAccordionClick);
         acc.addEventListener('click', handleAccordionClick);
      });
      
    }, 100);
  }, []);
  return null;
}
