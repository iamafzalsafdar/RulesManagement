# Rules Management

A web application for managing and editing rulesets, built with Next.js, React, Redux Toolkit, and Tailwind CSS.

## Features
- View, create, edit, copy, and delete rulesets
- Add, edit, delete, and reorder rules within a ruleset
- Drag-and-drop rule reordering (powered by @hello-pangea/dnd)
- Responsive and modern UI with Tailwind CSS and shadcn/ui components
- Import rulesets from JSON
- Confirmation dialogs for destructive actions
- Toast notifications for user feedback

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```powershell
   git clone <your-repo-url>
   cd RulesManagement
   ```
2. Install dependencies:
   ```powershell
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

### Running the Development Server
```powershell
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Building for Production
```powershell
pnpm build
# or
npm run build
# or
yarn build
```

### Starting the Production Server
```powershell
pnpm start
# or
npm start
# or
yarn start
```

## Project Structure
- `app/` - Next.js app directory (pages, layouts, routes)
- `components/` - Reusable UI and feature components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions
- `public/` - Static assets (including `mock_data.json` for demo data)
- `store/` - Redux Toolkit store and slices
- `styles/` - Global styles (Tailwind CSS)
- `types/` - TypeScript type definitions

## Customization
- UI components use [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- Theming is supported via `next-themes` and Tailwind CSS
- You can modify `public/mock_data.json` to change the initial rulesets

## License
This project is licensed under the MIT License.
