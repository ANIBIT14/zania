This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the dependencies using but ensure that you are using node version >= 18.18.0:

```bash
npm install --legacy-peer-deps
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Frontend Structure and UI Division

The frontend of this project is structured to ensure a clean separation of concerns and maintainability. The main components and their responsibilities are as follows:

### Components

- **DocumentGrid**: This component is responsible for displaying the grid of documents. It handles the drag-and-drop functionality using dnd-kit and manages the state of the documents.


- **DocumentCard**: This component represents an individual document card within the grid. It displays the document's thumbnail and title and handles the click event to show the image overlay.


- **ImageOverlay**: This component displays a full-size image of the document when a document card is clicked. It also handles closing the overlay when the escape key is pressed or the close button is clicked.

### Types

- **Document**: This type defines the structure of a document object, including its type, title, and position.

### Constants

- **images.ts**: This file contains mappings of document types to their respective thumbnail and full-size image URLs.

By organizing the frontend in this manner, we ensure that each component has a clear responsibility, making the codebase easier to understand and maintain.

## Architectural and API Design Approach

### Architectural Design

The architectural design of the server is centered around simplicity and maintainability. The server is designed to handle basic CRUD operations for document management, leveraging the App Router API routes in a Next.js application. The data is stored in a Vercel Postgres database to ensure persistence across page reloads and server restarts, providing a better user experience.

### API Design
The API design follows RESTful principles, with endpoints for fetching, updating, and adding documents. Each endpoint is designed to handle specific operations, ensuring a clear separation of concerns.

1. GET /api/documents: Fetches the list of documents from the Vercel Postgres database.
2. PUT /api/documents: Updates the list of documents in the Vercel Postgres database.
3. POST /api/documents: Adds a new document to the Vercel Postgres database.

### Implementation Details

- **Data Storage**: The data is stored in a Vercel Postgres database. This ensures that the data persists across page reloads and server restarts.

- **API Routes**: The API routes are implemented using the App Router in Next.js. Each route handles a specific HTTP method and performs the corresponding operation on the data.
