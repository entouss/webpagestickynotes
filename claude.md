# Web Page Sticky Notes (WPSN)

A Chrome extension that allows users to create, manage, and persist sticky notes on any web page.

## Architecture

### Extension Type
Chrome Extension using **Manifest V3** with:
- Service worker background script (not persistent background page)
- Content scripts injected on all URLs
- OAuth2 integration with Google Drive

### Key Components

```
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker - handles extension events, Google Drive sync, bookmarks
├── jquery.stickynotes.js  # Core jQuery plugin - main sticky notes functionality
├── container.js           # Initialization script for standalone pages
├── popup.js               # Toolbar action handler - creates a new note on click
├── blank.html             # Standalone note board page
├── board.html             # Alternative board page with full dependencies
└── vendor/                # Third-party libraries
```

### Data Flow

1. **Content Scripts** (`jquery.stickynotes.js`) - Injected into every page, manages note UI
2. **Background Service Worker** (`background.js`) - Handles:
   - Chrome bookmarks API for note persistence
   - Google Drive API for cloud sync
   - Tab badge updates
   - Context menus and keyboard commands
   - Message passing between tabs
3. **Storage** - Notes stored in Chrome bookmarks under "Web Page Sticky Notes" folder

### Storage Architecture

- **Local Storage**: Chrome Bookmarks API
  - Notes stored as bookmark titles (JSON serialized)
  - URL as bookmark URL for page association
  - Global notes stored at special URL: `chrome-extension://{extension_id}/board.html?global`
  - Domain-scoped notes use `wpsn.DOMAIN.{hostname}` key

- **Cloud Sync**: Google Drive API
  - Folder: `WebPageStickyNotes`
  - File: `sync.wpsn` (JSON, AES encrypted)
  - OAuth2 client for authentication

## Key Features

### Note Modes
- Markdown (default)
- Rich text (TinyMCE)
- Code (with syntax highlighting via Prettify)
- Diagrams (Mermaid, Flowchart, Sequence diagrams)
- Chess board
- Calendar (iCal support)
- Media (images, video, audio)
- RSS feeds
- Checklists

### Note Scopes
- Page-specific
- Domain-wide (`wpsn.DOMAIN.*`)
- Global (appears on all pages)

### UI Features
- Draggable, resizable, rotatable notes
- Snap-to-grid and magnetic alignment
- Color picker for backgrounds
- CSS filters (blur, grayscale, etc.)
- Transforms (scale, rotate, skew)
- Minimize/maximize/fullscreen
- Lock modes (fully locked, content-editable only)
- Z-index ordering
- Docking positions (top, bottom, left, right)

## Dependencies (Vendor Libraries)

| Library | Purpose |
|---------|---------|
| jQuery + jQuery UI | DOM manipulation, draggable/resizable |
| TinyMCE | Rich text editing |
| marked.js | Markdown parsing |
| Mermaid | Diagram rendering |
| D3.js | Data visualization |
| Chart.js | Charts |
| Luxon | Date/time handling |
| PapaParse | CSV parsing |
| Prettify | Code syntax highlighting |
| CryptoJS (AES) | Encryption for cloud sync |
| chess.js + chessboard.js | Chess functionality |
| ical.js | Calendar parsing |
| ImageTracer | SVG tracing |

## Chrome APIs Used

- `chrome.storage` - Local settings
- `chrome.bookmarks` - Note persistence
- `chrome.contextMenus` - Right-click menus
- `chrome.scripting` - Content script injection (MV3)
- `chrome.downloads` - Export functionality
- `chrome.identity` - OAuth2 for Google Drive
- `chrome.tabs` - Tab management, badge updates
- `chrome.commands` - Keyboard shortcuts
- `chrome.action` - Toolbar button (MV3)

## Message Passing

Background ↔ Content Script communication via `chrome.runtime.onMessage`:
- `synchronize` - Google Drive sync operations
- `screenshot` - Tab capture
- `stickyCount` - Badge updates
- `bookmark` - Save/load notes
- `loadNotes` / `saveNotes` - Note CRUD
- `download` / `upload` - File operations
- `github` - Commit to GitHub
- `command` - Keyboard shortcut actions

## Development Notes

### Branch Info
- Main branch: `master`
- Current work: `manifest3` (MV3 migration)

### Building
No build step required - vanilla JavaScript. Load unpacked extension in Chrome.

### Testing
Load the extension in Chrome at `chrome://extensions/` with Developer mode enabled.

### Key Keyboard Shortcuts
- `Alt+N` - Add note
- `Alt+B` - Open note board

### Context Menu Integration
Right-click menus available in:
- Browser action (toolbar icon)
- Page context
- Selection context
- Image/video/audio context
- Link context
