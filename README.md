# ChatApp: Frontend Developer Task

## Solution Overview

This is a chat application UI with WebSocket integration that enables real-time interaction with GPT. The application features multiple chat sessions in a sidebar, real-time communication with the backend, response visualization, and an intuitive user experience.

### UI Architecture

The application follows a component-based architecture with clear separation of concerns:

- **Main Page**: The chat interface located at `/chat`
- **Chat Panel**: Displays messages and handles user input
- **Sidebar**: Manages multiple chat sessions
- **Response Visualization**: Shows metrics and analytics about AI responses
- **WebSocket Hook**: Manages real-time communication with the backend

### Key Design Considerations

1. **Real-Time Communication**: Implemented WebSocket communication for seamless interaction with the AI assistant, including message streaming capability.

2. **State Management**: Used React hooks for managing application state, preserving chat history, and handling multiple chat sessions.

3. **Responsive UI**: Designed a mobile-friendly interface using Tailwind CSS for styling.

4. **Error Handling**: Implemented robust error handling for WebSocket connections, including reconnection logic and user feedback.

5. **Visualization**: Created a metrics panel to display response characteristics (time, length, sentiment).

6. **User Feedback**: Added thumbs up/down functionality for AI responses.

### Implementation Highlights

- **WebSocket Connection Management**: Handles connection, reconnection, and error scenarios gracefully.
- **Streaming Responses**: Supports real-time streaming of AI responses with typing indicators.
- **Multiple Sessions**: Users can create, rename, and switch between different chat sessions.
- **Responsive Design**: Works well on desktop, tablet, and mobile devices.
- **Metrics Visualization**: Shows analytics about AI responses to help users understand the system better.

### Challenges and Solutions

1. **WebSocket Reliability**:

   - Challenge: Ensuring stable WebSocket connections in various network conditions.
   - Solution: Implemented automatic reconnection logic with exponential backoff.

2. **Response Streaming**:

   - Challenge: Displaying streaming responses in a natural way.
   - Solution: Created a typing indicator and smooth text updates that mimic human typing.

3. **State Management**:

   - Challenge: Managing complex state across multiple components.
   - Solution: Used React hooks with carefully designed state structures to maintain application state.

4. **Performance**:
   - Challenge: Ensuring the UI remains responsive even with large chat histories.
   - Solution: Implemented windowing techniques and optimized rendering for long conversations.

### Future Improvements

With additional time, these enhancements could be made:

1. Add message search functionality
2. Implement chat export/import features
3. Enhance response visualization with more detailed metrics
4. Add authentication and user management
5. Improve image upload capabilities

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Start the backend server:
   ```
   make app
   ```

## Technical Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: FastAPI, WebSockets
- **AI Integration**: OpenAI GPT API
