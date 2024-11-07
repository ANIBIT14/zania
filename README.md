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

* **DocumentGrid**: This component is responsible for displaying the grid of documents. It handles the drag-and-drop functionality using @hello-pangea/dnd and manages the state of the documents.  


* **DocumentCard**: This component represents an individual document card within the grid. It displays the document's thumbnail and title and handles the click event to show the image overlay.


* **ImageOverlay**: This component displays a full-size image of the document when a document card is clicked. It also handles closing the overlay when the escape key is pressed or the close button is clicked.


### Hooks

* **useDocuments**: This custom hook manages the state of the documents, including loading, updating, and saving documents. It also handles error states and provides utility functions for adding and updating documents.

### Types


* **Document**: This type defines the structure of a document object, including its type, title, and position.


### Data
* **documents.json**: This file contains the initial data for the documents, including their types, titles, and positions.

### Constants
* **images.ts**: This file contains mappings of document types to their respective thumbnail and full-size image URLs.


By organizing the frontend in this manner, we ensure that each component has a clear responsibility, making the codebase easier to understand and maintain.

## Architectural and API Design Approach

### Architectural Design
The architectural design of the mock server is centered around simplicity and maintainability. The server is designed to handle basic CRUD operations for document management, leveraging the App Router API routes in a Next.js application. The data is stored in the local storage to ensure persistence across page reloads, providing a better user experience.

### API Design
The API design follows RESTful principles, with endpoints for fetching, updating, and adding documents. Each endpoint is designed to handle specific operations, ensuring a clear separation of concerns.  

1. GET /api/documents: Fetches the list of documents from the local storage.
2. PUT /api/documents: Updates the list of documents in the local storage.
3. POST /api/documents: Adds a new document to the local storage.

### Implementation Details
* **Data Storage**: The data is stored in the local storage using the localStorage API. This ensures that the data persists across page reloads and browser sessions.

* **API Routes**: The API routes are implemented using the App Router in Next.js. Each route handles a specific HTTP method and performs the corresponding operation on the data.

* **Delay Simulation**: A delay is introduced in each API route to simulate network latency, providing a more realistic experience during development.
