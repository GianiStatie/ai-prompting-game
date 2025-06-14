# AI Prompting Game - Frontend

## 🏗️ Architecture Overview

This frontend application has been completely refactored from a monolithic 544-line `App.tsx` component into a clean, maintainable, and well-structured React application.

### 🔧 Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Styled Components** for styling
- **Custom Hooks** for state management
- **Service Layer** for API interactions

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatContainer.tsx      # Chat display with auto-scroll
│   ├── PopupsContainer.tsx    # All popup components
│   ├── WelcomeMessage.tsx     # Welcome screen
│   ├── ChatMessage.tsx        # Individual message component
│   ├── LifeCounter.tsx        # Lives display
│   ├── AILevelCounter.tsx     # AI level indicator
│   ├── ChatHistory.tsx        # Chat history sidebar
│   ├── RulesSection.tsx       # Rules display
│   ├── Popup.tsx             # Generic popup component
│   ├── TipsPopup.tsx         # Tips and strategies popup
│   └── Confetti.tsx          # Celebration animation
│
├── hooks/               # Custom React hooks
│   ├── useChats.ts           # Chat state management
│   ├── useGameState.ts       # Game logic and state
│   ├── usePopups.ts          # Popup state management
│   ├── useChatInput.ts       # Input field logic
│   ├── useChatRename.ts      # Chat renaming logic
│   └── useUIState.ts         # UI state (drawer, panels)
│
├── services/            # API and external services
│   └── chatService.ts        # Chat API with streaming
│
├── utils/               # Utility functions
│   ├── localStorage.ts       # Local storage operations
│   └── chat.ts              # Chat utilities
│
├── styles/              # Styled components
│   ├── Layout.ts            # Layout components
│   ├── Chat.ts              # Chat-related styles
│   ├── Sidebar.ts           # Sidebar styles
│   └── Popup.ts             # Popup styles
│
├── types/               # TypeScript definitions
│   └── index.ts             # Main type definitions
│
├── config/              # Configuration files
│   └── game.ts              # Game constants
│
└── App.tsx              # Main application component (now clean!)
```

## 🎯 Key Refactoring Improvements

### Before vs After

| **Before** | **After** |
|------------|-----------|
| 544 lines in App.tsx | 200 lines in App.tsx |
| 15+ useState hooks | Organized custom hooks |
| Mixed concerns | Separated concerns |
| Monolithic component | Modular architecture |
| Hard to test | Easy to test |
| Complex state management | Clear state boundaries |

### 🧩 Custom Hooks

#### `useGameState`
Manages all game-related state and logic:
- Lives tracking
- Rules management
- Session completion
- Game reset functionality

#### `useChats`
Handles chat state management:
- Chat creation and deletion
- Message handling
- Chat history persistence

#### `usePopups`
Manages popup visibility and actions:
- Tips popup
- Game over popup
- Reset confirmation

#### `useChatInput`
Controls chat input behavior:
- Auto-resize textarea
- Input validation
- Focus management
- Keyboard shortcuts

#### `useChatRename`
Handles chat renaming functionality:
- Edit mode state
- Save/cancel operations
- Keyboard navigation

#### `useUIState`
Manages UI state:
- Drawer visibility
- Rules panel state
- General UI interactions

### 🔧 Services Layer

#### `ChatService`
Encapsulates all chat API operations:
- Streaming chat responses
- Session management
- Error handling
- Game reset API calls

## 🎨 Component Architecture

### Container Components
- **PopupsContainer**: Manages all popup rendering
- **ChatContainer**: Handles chat display and auto-scrolling

### Feature Components
- Clean separation of concerns
- Focused responsibilities
- Easy to test and maintain

## 🔄 State Management Strategy

1. **Local Component State**: For simple UI interactions
2. **Custom Hooks**: For complex state logic
3. **Service Layer**: For API interactions
4. **LocalStorage**: For persistence

## 🛠️ Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { useGameState } from '../../../hooks/useGameState'
import { useGameState } from '@/hooks/useGameState'

// Available aliases:
// @/* - src/*
// @/components/* - src/components/*
// @/hooks/* - src/hooks/*
// @/services/* - src/services/*
// @/utils/* - src/utils/*
// @/types/* - src/types/*
// @/styles/* - src/styles/*
// @/config/* - src/config/*
```

## 🚀 Development Benefits

### Maintainability
- Each concern is isolated
- Easy to locate and modify features
- Clear data flow and dependencies

### Testability
- Hooks can be tested in isolation
- Components have clear interfaces
- Service layer is mockable

### Scalability
- Easy to add new features
- Minimal coupling between components
- Clear extension points

### Developer Experience
- Faster development cycles
- Better IDE support with path aliases
- Clear code organization

## 🔍 Key Patterns Used

1. **Custom Hooks Pattern**: Encapsulate stateful logic
2. **Container/Presenter Pattern**: Separate logic from presentation
3. **Service Layer Pattern**: Abstract API interactions
4. **Composition Pattern**: Build complex UIs from simple components

## 📋 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing Recommendations

With the new architecture, you can easily test:

1. **Hooks**: Test state management logic in isolation
2. **Components**: Test rendering and user interactions
3. **Services**: Mock API calls and test business logic
4. **Utils**: Test utility functions

## 🎯 Future Enhancements

The refactored architecture makes it easy to add:

- Unit tests for hooks and components
- Integration tests for user flows
- Additional game features
- Performance optimizations
- Accessibility improvements

## 📖 Code Quality

The refactoring follows React best practices:
- Single Responsibility Principle
- Don't Repeat Yourself (DRY)
- Separation of Concerns
- Clean Code principles
- TypeScript for type safety 