'use client';

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import styles from './RichEditor.module.css';

interface RichEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

function ToolbarBtn({ onClick, active, title, children }: any) {
    return (
        <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            className={`${styles.toolbarBtn} ${active ? styles.active : ''}`}
            title={title}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <span className={styles.divider} />;
}

export function RichEditor({ value, onChange, placeholder = 'Start writing...' }: RichEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Underline,
            TextStyle,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false, autolink: true }),
            Image.configure({ inline: false, allowBase64: true }),
            Placeholder.configure({ placeholder }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: { class: styles.editorArea },
        },
    });

    const addImage = useCallback(() => {
        const url = window.prompt('Image URL:');
        if (url && editor) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes('link').href;
        const url = window.prompt('Link URL:', prev || 'https://');
        if (url === null) return;
        if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    const wordCount = editor.getText().split(/\s+/).filter(Boolean).length;
    const charCount = editor.getText().length;

    return (
        <div className={styles.wrapper}>
            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                {/* History */}
                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7h10a5 5 0 1 1 0 10H9" /><path d="M3 7l3-3m-3 3 3 3" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 7H11a5 5 0 1 0 0 10h4" /><path d="M21 7l-3-3m3 3-3 3" /></svg>
                </ToolbarBtn>
                <Divider />

                {/* Heading select */}
                <select
                    className={styles.selectHeading}
                    value={
                        editor.isActive('heading', { level: 1 }) ? 'h1'
                            : editor.isActive('heading', { level: 2 }) ? 'h2'
                                : editor.isActive('heading', { level: 3 }) ? 'h3'
                                    : 'p'
                    }
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v === 'p') editor.chain().focus().setParagraph().run();
                        else editor.chain().focus().setHeading({ level: parseInt(v[1]) as 1 | 2 | 3 }).run();
                    }}
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>
                <Divider />

                {/* Inline */}
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <strong>B</strong>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <em>I</em>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                    <u>U</u>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                    <s>S</s>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
                </ToolbarBtn>
                <Divider />

                {/* Alignment */}
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h12M3 18h15" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M6 12h12M4.5 18h15" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M9 12h12M6 18h15" /></svg>
                </ToolbarBtn>
                <Divider />

                {/* Lists */}
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 7h13M8 12h13M8 17h13" /><circle cx="3.5" cy="7" r="1.2" fill="currentColor" stroke="none" /><circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="3.5" cy="17" r="1.2" fill="currentColor" stroke="none" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h1M3 12h1M3 18h1" strokeWidth="1.5" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="3" /><path d="M8 10l-3 3 3 3M16 10l3 3-3 3" /></svg>
                </ToolbarBtn>
                <Divider />

                {/* Media */}
                <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Insert Link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={addImage} title="Insert Image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18" /></svg>
                </ToolbarBtn>
            </div>

            {/* ── Editor ── */}
            <EditorContent editor={editor} className={styles.editorContainer} />

            {/* ── Footer stats ── */}
            <div className={styles.footer}>
                {wordCount} words &nbsp;·&nbsp; {charCount} characters
            </div>
        </div>
    );
}
