# Answer Browser

Answer is a sleek, fast, and intelligent personal desktop web browser that provides direct answers using AI. Built with a modern tech stack including React, TypeScript, and Tailwind CSS, and designed for performance and a great user experience.

![Answer Browser Screenshot](https://i.imgur.com/your-screenshot-url.png)
*(Note: Replace with an actual screenshot of the application)*

## Features

- **AI-Powered Answers**: Integrates the Gemini API to provide direct, source-backed answers to your search queries.
- **Modern Tab Management**: A fluid and responsive tab bar with drag-and-drop reordering.
- **Persistent User Data**: Bookmarks, history, and downloads are saved locally to your machine.
- **Comprehensive Settings**: Customize your experience with options for search engine, privacy, and appearance.
- **Performance Optimized**: Lazy-loaded components and a lightweight design ensure a fast and responsive UI.
- **Accessibility Focused**: Built with semantic HTML, ARIA attributes, and high-contrast theme options to be usable by everyone.
- **Interactive Sound Cues**: Optional audio feedback for common actions, enhancing the user experience.
- **Polished Animations**: A smooth startup animation and fluid UI transitions powered by Framer Motion.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **Desktop Packaging**: [Electron](https://www.electronjs.org/) (via Electron Builder)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A valid Gemini API Key

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/answer-browser.git
    cd answer-browser
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    API_KEY=your_gemini_api_key_here
    ```

### Running the Application

-   **Development Mode**:
    This command starts the application in a hot-reloading development environment.
    ```bash
    npm start
    ```

-   **Production Build**:
    This command builds and optimizes the application for production.
    ```bash
    npm run build
    ```

-   **Package for Desktop**:
    This command packages the production build into a distributable desktop application for your current OS (Windows or macOS).
    ```bash
    npm run package
    ```
    The packaged application will be located in the `dist` directory.

## Keyboard Shortcuts

To improve productivity, Answer Browser supports the following keyboard shortcuts:

| Shortcut              | Action                               |
| --------------------- | ------------------------------------ |
| `Cmd/Ctrl + L`        | Focus the Omnibox (address/search bar) |
| `Escape`              | Unfocus the Omnibox                  |
| `Enter` (in Omnibox)  | Perform search or navigate to URL    |

---

Thank you for using Answer Browser!
