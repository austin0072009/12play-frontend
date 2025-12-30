# Lottery 2D/3D API Integration Reference

This document records the Vue2 lottery implementation patterns from `Frontend_Master9` project for reference during React integration.

## API Base Configuration

**Base URL:** `https://game.sea2d3d.com`
**Content-Type:** `application/json`
**Authentication:** Authorization header with token

## Vue2 Store Structure (lottery2D.js)

### State
```javascript
{
  userInfo: {},           // User profile, balance, api_domain, token
  token: null,           // API token from login
  betTime: [],           // Pending sessions (winState: 1)
  historyBetSession: [], // Completed sessions (winState: 3)
  selectIssue: null,     // Currently selected bet issue
  betCloseTime: null,    // Bet closing time for current session
  betNumbers: [],        // Available numbers for betting
  closedDay: [],         // Closed days configuration
  winners: [],           // Win rankings
  betRecords: {},        // Bet records keyed by issue
}
```

### Key Mutations
- `setUserInfo(state, info)` - Store user info from API
- `setToken(state, token)` - Store authentication token
- `setBetTime(state, betTime)` - Store pending bet sessions
- `setHistoryBetSession(state, historyBetSession)` - Store completed sessions
- `setSelectIssue(state, selectIssue)` - Store selected issue for betting
- `setBetCloseTime(state, betCloseTime)` - Store bet closing time
- `setBetNumbers(state, betNumbers)` - Store available numbers
- `setClosedDay(state, closedDay)` - Store closed days

## Vue2 Service Methods (lottery2D.js)

### fetchUserInfo()
```javascript
// POST to /api/v3/user/info
// Headers: Authorization: Bearer {token}
// Body: {} (empty)
// Returns: User info including balance, api_domain, token
```

### fetchBetSession()
```javascript
// POST to /api/v3/history/session
// Headers: Authorization: Bearer {token}
// Body: { gameId: 1, winState: 1 } // winState: 1 = pending
// Returns: Array of bet sessions sorted by win_time
// Data structure:
{
  issue: string,
  win_time: "2024-12-29 16:30:00.0",
  set: "1,482.50",
  value: "29,083.51",
  win_num: "03"
}
```

### fetchHistoryBetSession()
```javascript
// POST to /api/v3/history/session
// Body: { gameId: 1, winState: 3 } // winState: 3 = completed/drawn
// Returns: Historical completed sessions
```

### fetchBetNumbers()
```javascript
// POST to /api/v3/session/number
// Body: { gameId: 1, issue: "selected_issue" }
// Returns: Array of available numbers for that issue
```

### bet(items)
```javascript
// POST to /api/v3/bet
// Body: {
//   gameId: 1,
//   issue: "selected_issue",
//   betInfo: [
//     { number: "01", amount: 100 },
//     { number: "02", amount: 200 }
//   ]
// }
```

### fetchBetRecords()
```javascript
// POST to /api/v3/bet/record
// Body: { gameId: 1, issue: "", page: "", pageSize: 1000 }
```

### fetchBetRecordsWithDate(date, page, issue)
```javascript
// POST to /api/v3/bet/details
// Body: { gameId: 1, date, page, size: 1000, issue }
```

## Vue2 Component Flow (lotteryTwoHome.vue)

1. **On Mount**
   - Call `fetchLatestResult()` to get current 2D result
   - Call `fetchBetSession()` to get pending sessions
   - Call `fetchHistoryBetSession()` to get completed sessions
   - Auto-refresh every N seconds

2. **Data Display**
   - Main number: Latest result from API
   - Update time: Formatted timestamp
   - Set/Value: From current session
   - Bet sessions: Sorted by time, showing 2 latest results

3. **Closed Day Check**
   - Check Myanmar timezone (UTC+6:30)
   - Type 1: Day of week (0=Sunday, 7=Sunday)
   - Type 2: Specific date (YYYY-MM-DD)
   - Return remark if closed

4. **Time Slot Selection**
   - Allow filtering by time slot
   - Currently only "12:01PM & 4:30PM" is active

5. **Bet Modal**
   - Check if closed before allowing bet
   - Navigate to bet page with selected issue

## Key Patterns from Vue2

### Timezone Handling
```javascript
getMyanmarTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const myanmarOffset = 6.5 * 60 * 60 * 1000; // UTC+6:30
  return new Date(utc + myanmarOffset);
}
```

### Data Sorting
- Sessions sorted by win_time (time portion only, early to late)
- Results displayed newest first

### Error Handling
- Wrapped in try-catch blocks
- Errors logged to console
- UI shows "N/A" for missing data

### Data Structures
- Sessions keyed by issue in store
- Records grouped by date and issue
- Balance and amounts stored as strings, parsed on display

## Closed Days API Response
```javascript
closedDay: [
  { type: 1, day: 5, remark: "Friday 5PM closed" },  // Type 1: day of week
  { type: 2, date: "2024-12-25", remark: "Holiday" } // Type 2: specific date
]
```

## Import Statement from Lottery2DHome.vue
```javascript
import Lottery2D from "../../tools/method/lottery2D";
import Banner from "./banner.vue";
import Home from "../../tools/method/home";
import LotteryTwoBetModal from "./lotteryTwoBetModal.vue";
```

The `Lottery2D` object contains all methods bound to `this` context (Vue component this).

## Notes for React Integration

1. **Token Persistence**: Store token in Zustand with persist middleware
2. **Domain Handling**: Keep api_domain from lottery backend in state
3. **Timezone**: Use same Myanmar time calculation in utils
4. **Auto-refresh**: Use useEffect with setInterval
5. **Error UI**: Show toast/alert instead of console.error
6. **Session Sorting**: Sort by time portion, preserve order
7. **Closed Day Check**: Run on component mount and before allowing bets
8. **Type Safety**: Create TypeScript interfaces for all API responses
