# Lottery 2D/3D API Integration - Implementation Guide

## Overview

This guide explains how the Lottery 2D API integration works in the React frontend and how to integrate it into your existing application flow.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Main App                                  │
│                    (Vite + React)                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
   ┌────▼──────────────┐          ┌──────────▼───────────┐
   │  Main Backend API │          │ Lottery Backend API  │
   │ /nweb/login etc   │          │ /api/v3/* endpoints  │
   └────┬──────────────┘          └──────────┬───────────┘
        │                                    │
        │                            ┌──────▼────────┐
        │                            │  Zustand Store│
        │                            │  useLotteryS..│
        │                            └──────┬────────┘
        │                                   │
        └──────────────────┬────────────────┘
                           │
                ┌──────────▼──────────┐
                │   Components:       │
                │ - Lottery2DHome.tsx │
                │ - Lottery2DBet.tsx  │
                │ - Lottery2DResult.. │
                └────────────────────┘
```

## Flow: Login to Lottery Betting

### Phase 1: Main App Authentication
```typescript
// 1. User logs in via main backend
const loginResponse = await loginApi({
  name: username,
  password: password,
});

// Response includes main app token
// {
//   token: "main-app-token",
//   member: { ... },
//   yzflag: boolean,
//   qk_pwd: boolean
// }
```

### Phase 2: Exchange for Lottery Token
```typescript
// 2. Use Ky_login (likely in a game integration endpoint)
// to get lottery system ticket/token

const lotteryToken = "lottery-system-token";
const lotteryDomain = "https://game.sea2d3d.com";

// 3. Store credentials in Zustand
useLotteryStore.setState({
  lotteryToken,
  lotteryDomain,
  gameType: 'L2D'
});
```

### Phase 3: Access Lottery Pages
```typescript
// 4. Once credentials are in store, components can:
// - Lottery2DHome.tsx: View results, pending draws
// - Lottery2DBet.tsx: Place bets
// - Lottery2DHistory.tsx: View bet records
// - Lottery2DWinners.tsx: View rankings
```

## Component Integration Examples

### Example 1: Add Lottery to MainLayout

```typescript
// src/layout/MainLayout.tsx
import { useLotteryStore } from '../store/lottery';

export function MainLayout() {
  const { lotteryToken, setLotteryCredentials } = useLotteryStore();

  // When user logs into main app
  const handleMainLogin = async (credentials) => {
    // ... login logic ...
    
    // Get lottery token/domain from game integration
    const { lotteryToken, lotteryDomain } = await getGameToken();
    
    // Store in lottery store
    setLotteryCredentials(lotteryToken, lotteryDomain, 'L2D');
  };

  return (
    <div>
      {/* Existing layout */}
      {lotteryToken && <LotteryNav />}
    </div>
  );
}
```

### Example 2: Protected Lottery Route

```typescript
// src/router/index.tsx
import { useLotteryStore } from '../store/lottery';

const ProtectedLotteryRoute = ({ children }) => {
  const { lotteryToken } = useLotteryStore();
  const navigate = useNavigate();

  if (!lotteryToken) {
    return (
      <div>
        <p>Please log in to access lottery features</p>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  return children;
};

// In route definition:
{
  path: '/2d',
  element: (
    <ProtectedLotteryRoute>
      <Lottery2DHome />
    </ProtectedLotteryRoute>
  )
}
```

### Example 3: Error Handling

```typescript
// src/components/LotteryErrorBoundary.tsx
import { useLotteryStore } from '../store/lottery';

export function LotteryErrorBoundary({ children }) {
  const { error, setError } = useLotteryStore();

  if (error) {
    return (
      <div className="error-banner">
        <p>{error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  return children;
}
```

## State Management Reference

### Store Structure
```typescript
interface LotterySessionState {
  // Auth
  lotteryToken: string;
  lotteryDomain: string;
  gameType: 'L2D' | 'L3D';

  // User
  userInfo: {
    balance?: number;
    username?: string;
    [key: string]: any;
  };

  // 2D Data
  pendingSessions: BetSessionData[];    // Open for betting
  completedSessions: BetSessionData[];  // Already drawn
  selectedIssue: string | null;
  betCloseTime: string | null;

  // System
  closedDays: ClosedDay[];
  availableBetNumbers: number[];

  // UI States
  isLoadingUserInfo: boolean;
  isLoadingSessions: boolean;
  error: string | null;
}
```

### Reading State
```typescript
import { useLotteryStore } from '../store/lottery';

function MyComponent() {
  const {
    userInfo,        // { balance, username, ... }
    pendingSessions, // Array of upcoming draws
    completedSessions, // Array of past results
    error,           // Error message string
    isLoadingSessions // Loading indicator
  } = useLotteryStore();

  return (
    <div>
      {isLoadingSessions ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h2>Balance: {userInfo?.balance}</h2>
          <p>Next Draw: {pendingSessions[0]?.win_time}</p>
        </>
      )}
    </div>
  );
}
```

### Mutating State
```typescript
// Update user info
setUserInfo({ balance: 5000, username: 'john' });

// Update sessions
setPendingSessions(pendingSessionsArray);
setCompletedSessions(completedSessionsArray);

// Set errors
setError('Failed to load sessions');

// Clear error
setError(null);

// Logout/Clear all
clearLotterySession();
```

## API Integration Points

### Available API Functions

```typescript
import {
  // User
  getLotteryUserInfo,
  
  // Sessions & Results
  getBetSessions,
  get2DLiveResult,
  
  // Betting
  getSessionNumbers,
  placeBet,
  
  // History & Rankings
  getWinRanking,
  getBetStatistics,
  getBetRecords,
  
  // Other
  getGameResource,
  getGameList,
} from '../services/lottery';
```

### Token Management

```typescript
import { setLotteryToken } from '../utils/lotteryRequest';

// After login/exchange
setLotteryToken(token);

// All subsequent requests auto-include:
// Authorization: Bearer {token}
```

## Data Transformation Examples

### Session Sorting
```typescript
// From API (unsorted)
const sessions = [
  { issue: '1', win_time: '2024-12-29 16:30:00.0', ... },
  { issue: '2', win_time: '2024-12-29 12:00:00.0', ... },
];

// Sort by time (early to late)
const sorted = sessions.sort((a, b) => {
  const timeA = a.win_time.split(" ")[1].split(".")[0];
  const timeB = b.win_time.split(" ")[1].split(".")[0];
  return timeA.localeCompare(timeB);
});

// For results display (latest first)
const reversed = sorted.reverse();
```

### Time Formatting
```typescript
// From API: "2024-12-29 16:30:00.0"
// Display: "16:30"

function formatTime(isoString: string): string {
  try {
    const timePart = isoString.split(" ")[1];
    const [hour, minute] = timePart.split(":").slice(0, 2);
    return `${hour}:${minute}`;
  } catch {
    return "N/A";
  }
}
```

### Session Separation
```typescript
// API returns mixed sessions with winState field
const allSessions = await getBetSessions();

// Separate:
const pending = allSessions.filter(s => s.winState === 1);
const completed = allSessions.filter(s => s.winState === 3);

// Or in reducer:
const pending: BetSessionData[] = [];
const completed: BetSessionData[] = [];

allSessions.forEach(session => {
  if (session.winState === 1) pending.push(session);
  else if (session.winState === 3) completed.push(session);
});
```

## Common Patterns

### Auto-Refresh Data
```typescript
useEffect(() => {
  // Initial load
  fetchUserInfo();
  fetchBetSessions();

  // Refresh every 30 seconds
  const interval = setInterval(() => {
    fetchBetSessions();
    fetchLiveResult();
  }, 30000);

  return () => clearInterval(interval);
}, [lotteryToken, lotteryDomain]);
```

### Handle Loading & Errors
```typescript
const { isLoadingSessions, error } = useLotteryStore();

return (
  <>
    {error && <ErrorAlert message={error} />}
    {isLoadingSessions && <LoadingSpinner />}
    {!error && !isLoadingSessions && <Content />}
  </>
);
```

### Conditional Rendering
```typescript
// Show when logged in
{lotteryToken && <LotteryNav />}

// Show when data loaded
{completedSessions.length > 0 && (
  <ResultsList sessions={completedSessions} />
)}

// Show when closed
{isClosedDay && <ClosedNotice />}
```

## Debugging Tips

### Check Store State
```typescript
// In browser console
import { useLotteryStore } from '../store/lottery';
const state = useLotteryStore.getState();
console.log(state);
```

### Monitor API Calls
```typescript
// Check network tab in DevTools
// All requests to https://game.sea2d3d.com/api/v3/*
// Should include: Authorization: Bearer {token}
```

### Enable Debug Logging
```typescript
// Add to component
const { error } = useLotteryStore();
useEffect(() => {
  if (error) console.error('Lottery error:', error);
}, [error]);
```

## Testing Checklist

- [ ] User can log in to main app
- [ ] Lottery token is stored in Zustand
- [ ] Lottery2DHome page loads
- [ ] User balance displays
- [ ] Pending sessions show next draw
- [ ] Completed sessions show results
- [ ] Error messages display on API failure
- [ ] Auto-refresh triggers every 30 seconds
- [ ] Countdown timer (if implemented) counts down
- [ ] Bet button is disabled when not logged in
- [ ] Navigation to bet page works
- [ ] Browser refresh maintains session (token persisted)

## Next Steps

1. **Integrate Game Token Exchange**
   - Connect main app login to lottery token endpoint
   - Store token in Zustand automatically

2. **Implement Closed Day Logic**
   - Fetch closed days from API/config
   - Disable betting on closed days

3. **Add Countdown Timer**
   - Calculate seconds until next draw
   - Update every second

4. **Implement Bet Placement**
   - Create bet modal/page
   - Call `placeBet()` API
   - Show confirmation

5. **Add Result Animation**
   - Fetch latest result
   - Display with animation
   - Update when drawn

6. **Implement Bet History**
   - Display user's past bets
   - Show win/loss status
   - Filter by date/issue

## Resources

- **API Documentation**: See `2d3dapi.md` in project root
- **Store Reference**: `src/store/lottery.ts`
- **Component Example**: `src/pages/Lottery2DHome.tsx`
- **Service Layer**: `src/services/lottery.ts`
- **Integration Reference**: `LOTTERY_API_INTEGRATION_REFERENCE.md`
- **Vue2 Original**: `Frontend_Master9/src/components/template01/lotteryTwoHome.vue`

## Support & Troubleshooting

### Token Not Persisting
- Check store persistence config in `lottery.ts`
- Verify `localStorage` is enabled
- Check browser console for errors

### API Calls Failing
- Verify `VITE_LOTTERY_API_BASE_URL` environment variable
- Check `Authorization` header in network requests
- Ensure token is set via `setLotteryToken()`

### Data Not Loading
- Check network tab for API responses
- Verify API responses match expected structure
- Check for `winState` field in sessions

### UI Not Updating
- Verify component is using `useLotteryStore()` hook
- Check if state mutations are called correctly
- Use React DevTools to inspect store state
