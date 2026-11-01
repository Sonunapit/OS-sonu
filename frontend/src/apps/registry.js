import { lazy } from 'react';
import { User, FolderGit2, Cpu, GraduationCap, FileText, Images, Terminal, Mail, NotebookPen, Settings, FolderOpen, Activity } from 'lucide-react';

// One entry per application. Every OS renders the same apps in its own chrome.
export const APPS = {
  about:    { title: 'About',        icon: User,          tint: ['#6aa5ff', '#3b6df0'], size: { w: 780, h: 540 }, Component: lazy(() => import('./AboutApp.jsx')) },
  projects: { title: 'Projects',     icon: FolderGit2,    tint: ['#b58cff', '#6f4de0'], size: { w: 900, h: 580 }, Component: lazy(() => import('./ProjectsApp.jsx')) },
  skills:   { title: 'Skills',       icon: Cpu,           tint: ['#4be0a8', '#169b73'], size: { w: 760, h: 520 }, Component: lazy(() => import('./SkillsApp.jsx')) },
  timeline: { title: 'Education',    icon: GraduationCap, tint: ['#ffb86b', '#e8782a'], size: { w: 700, h: 500 }, Component: lazy(() => import('./TimelineApp.jsx')) },
  resume:   { title: 'Resume',       icon: FileText,      tint: ['#ff7b8f', '#d93a5a'], size: { w: 860, h: 620 }, Component: lazy(() => import('./ResumeApp.jsx')) },
  gallery:  { title: 'Gallery',      icon: Images,        tint: ['#ff9bd0', '#d44fa0'], size: { w: 880, h: 580 }, Component: lazy(() => import('./GalleryApp.jsx')) },
  terminal: { title: 'Terminal',     icon: Terminal,      tint: ['#4a5568', '#1a202c'], size: { w: 720, h: 460 }, Component: lazy(() => import('./TerminalApp.jsx')) },
  files:    { title: 'Files',        icon: FolderOpen,    tint: ['#5fd0ff', '#1d8fd1'], size: { w: 720, h: 480 }, Component: lazy(() => import('./FilesApp.jsx')) },
  contact:  { title: 'Contact',      icon: Mail,          tint: ['#7be0ff', '#2a9fd6'], size: { w: 560, h: 520 }, Component: lazy(() => import('./ContactApp.jsx')) },
  notepad:  { title: 'Notepad',      icon: NotebookPen,   tint: ['#ffe27a', '#e0b020'], size: { w: 560, h: 420 }, Component: lazy(() => import('./NotepadApp.jsx')) },
  sysinfo:  { title: 'System',       icon: Activity,      tint: ['#8be28b', '#3a9d4a'], size: { w: 560, h: 440 }, Component: lazy(() => import('./SysInfoApp.jsx')) },
  settings: { title: 'Settings',     icon: Settings,      tint: ['#aab3c2', '#6b7587'], size: { w: 620, h: 480 }, Component: lazy(() => import('./SettingsApp.jsx')) },
};
export const APP_IDS = Object.keys(APPS);
export const MOBILE_APP_IDS = ['about', 'projects', 'skills', 'timeline', 'resume', 'gallery', 'contact', 'terminal', 'notepad', 'settings'];
