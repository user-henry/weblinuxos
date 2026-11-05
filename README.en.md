**English** | [简体中文](README.md)

# Web Linux OS (weblinuxos)

> A Linux desktop simulator that runs in the browser: from the GRUB boot menu and kernel log to login and a complete desktop environment, with 55 registered applications, 9 categories and a tree-structured virtual file system.

## Features

| Module | Description |
|---|---|
| Boot sequence | GRUB menu → scrolling kernel log → login screen → desktop, driven by a `bootPhase` state machine |
| Window management | Drag, resize, minimize/maximize, Z-order, singleton and multi-instance apps |
| App ecosystem | 55 registered app entries and 56 app components across 9 categories: system, development, internet, office, multimedia, graphics and utilities |
| Virtual file system | Tree nodes + parent pointers, permission strings and owners, copy/cut/paste |
| State management | Zustand stores split by domain: windows, app registry, file system, settings and system |
| Appearance | Theme and accent color injected as CSS variables, built on Tailwind + shadcn/ui |
| Interaction | Super key opens the app menu; dock, top bar, desktop icons and context menus |

## App categories

| Category | Count | Examples |
|---|---|---|
| Core system | 8 | Terminal, file manager, settings, task manager, calculator, text editor, calendar, clock |
| Development | 9 | Code editor, Git client, API client, database explorer, regex tester, JSON viewer, Markdown preview, color picker, diff viewer |
| Internet | 5 | Browser, email, chat, weather, news |
| Office | 5 | Writer, spreadsheet, presentation, PDF viewer, notepad |
| Multimedia | 5 | Music, video, images, camera, voice |
| Graphics | 4 | Paint, image editor, SVG viewer, icon maker |
| System utilities | 8 | Screenshot, system info, disk usage, backup, file search, network, encryption, archive |
| Accessories | 5 | Help, trash, dictionary, translator, stopwatch |
| Utility accessories | 6 | Password generator, QR code, unit converter, sticky notes, font viewer, archive manager |

## Tech stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 3.4 · shadcn/ui · Zustand · Framer Motion

## Running locally

```bash
npm install
npm run dev      # development server
npm run build    # production build (tsc -b && vite build)
npm run preview  # preview the build
```

## Live demo

<https://user-henry.github.io/weblinuxos/>

## Project structure

```text
src/
├── apps/            # 55+ applications (one directory per app)
├── components/      # Boot sequence, desktop, dock, top bar, window frame, app menu
├── stores/          # Window / app registry / file system / settings / system
├── hooks/           # Shared hooks
└── main.tsx         # Entry point
```

## Notes

- The project is an experimental playground for desktop environments and frontend architecture; most in-app data is interactive demo data and does not connect to a real backend.
- The virtual file system lives in memory/local state and resets to the initial image on refresh.
- A recent Chrome / Edge / Firefox is recommended.

## License

MIT License
