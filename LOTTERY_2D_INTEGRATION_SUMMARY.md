# Lottery 2D Home - API Integration Summary

## ✅ Completed Integration

Successfully integrated API login and data fetching into the `Lottery2DHome.tsx` component based on Vue2 patterns from `Frontend_Master9`.

## 📋 Files Modified

### 1. **src/store/lottery.ts** - Enhanced State Management
- **Added Types:**
  - `BetSessionData` - Bet session interface with issue, win_time, set, value, win_num
  - `UserInfoData` - User profile with balance, username, token, api_domain
  - `ClosedDay` - Closed day configuration (type 1 for day of week, type 2 for specific dates)

- **Expanded State:**
  - `lotteryToken` - API authentication token
  - `lotteryDomain` - Lottery backend domain
  - `userInfo` - User profile and balance data
  - `pendingSessions` - Bet sessions with winState = 1 (open for betting)
  - `completedSessions` - Bet sessions with winState = 3 (drawn results)
  - `closedDays` - Closed day configuration
  - `betCloseTime` - Bet closing time
  - `availableBetNumbers` - Available numbers for current session
  - `isLoadingUserInfo` - Loading state for user info
  - `isLoadingSessions` - Loading state for sessions
  - `error` - Error message storage

- **Added Actions:**
  - `setUserInfo()` - Store user profile
  - `setPendingSessions()` - Store open bet sessions
  - `setCompletedSessions()` - Store drawn results
  - `setSelectedIssue()` - Track selected bet issue
  - `setClosedDays()` - Store closed day config
  - `setBetCloseTime()` - Store bet closing time
  - `setAvailableBetNumbers()` - Store available numbers
  - `setLoadingUserInfo()` / `setLoadingSessions()` - Control loading states
  - `setError()` - Store error messages

### 2. **src/pages/Lottery2DHome.tsx** - Component Integration
Complete rewrite with API-driven features:

#### Data Fetching
- **`fetchUserInfo()`** - Retrieves user profile and balance from lottery backend
- **`fetchBetSessions()`** - Fetches both pending (winState=1) and completed (winState=3) sessions
- **`fetchLiveResult()`** - Gets current 2D live result
- Auto-refresh every 30 seconds via `useEffect`

#### Utility Functions
- **`getMyanmarTime()`** - Converts current time to Myanmar timezone (UTC+6:30)
- **`isClosedDay()`** - Checks if betting is closed today (expandable with API config)
- **`calculateCountdown()`** - Calculates time until next draw
- **`formatTime()`** - Extracts HH:MM from ISO datetime string

#### UI Components
1. **Error Display** - Shows error messages from API calls
2. **User Balance Section** - Displays user balance and username
3. **Next Draw Card** - Shows next draw time and countdown
4. **Latest Result** - Displays most recent drawn number
5. **Results List** - Shows last 3 completed draws
6. **Bet Button** - Disabled when:
   - User not logged into lottery system
   - Betting is closed
   - Includes tooltip messages

#### Data Flow
```
1. Component mounts → fetchUserInfo() + fetchBetSessions() + fetchLiveResult()
2. Lottery store populated with:
   - userInfo (balance, username)
   - pendingSessions (upcoming draws)
   - completedSessions (past results)
3. Every 30 seconds:
   - fetchLiveResult() + fetchBetSessions() refresh
4. UI updates reactively from Zustand store
```

## 🔄 API Calls Used

Based on 2D3D API documentation:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v3/user/info` | POST | Get user profile & balance |
| `/api/v3/history/session` | POST | Get pending (winState=1) and completed (winState=3) sessions |
| `/api/v1/2d/result` | GET | Get latest 2D result |

## 🎯 Key Features

### Authentication Flow
1. Main app logs user in via `/nweb/login` (main backend)
2. Gets lottery ticket from response
3. Exchanges ticket for lottery token via `/api/v1/exchange/certificates`
4. Sets `lotteryToken` in store and `lotteryRequest` utility
5. All lottery API calls auto-include `Authorization: Bearer {token}` header

### Session Management
- Pending sessions (winState=1) shown as "Next Draw"
- Completed sessions (winState=3) shown as results history
- Sorted by draw time (early to late)
- Supports multiple draw times per day

### Closed Day Handling
- Myanmar timezone aware
- TODO: Integrate with API-provided closed day config
- Currently always allows betting (fallback behavior)
- Can be expanded to check:
  - Type 1: Day of week (e.g., weekends)
  - Type 2: Specific dates (e.g., holidays)

### Loading & Error States
- Separate loading states for user info vs sessions
- Error messages display in UI
- Console logs for debugging
- Graceful fallbacks (shows "N/A" for missing data)

## 🔧 Configuration

### Environment Variables
```
VITE_LOTTERY_API_BASE_URL=https://game.sea2d3d.com
```

### Store Persistence
- Only persists: `lotteryToken`, `lotteryDomain`, `gameType`
- Session data refreshes on each load
- User info fetched fresh on component mount

## 📝 Reference Documents

See **LOTTERY_API_INTEGRATION_REFERENCE.md** for:
- Complete Vue2 pattern documentation
- API response structures
- Data transformation examples
- Store mutation patterns
- Service method signatures

## ⚠️ TODO / Future Enhancements

1. **Closed Day Configuration**
   - Fetch closed days from API or system config
   - Implement type 1 (weekday) and type 2 (specific date) checks

2. **Countdown Timer**
   - Implement real countdown calculation
   - Update every second instead of static value

3. **Game Resource Loading**
   - Fetch banners via `/api/v3/game/resource`
   - Fetch notifications

4. **Error Recovery**
   - Implement retry logic for failed API calls
   - Show retry button for failed requests

5. **Performance Optimization**
   - Memoize expensive computations
   - Implement request debouncing
   - Add request cancellation for unmounted components

6. **Real 2D Result Display**
   - Show latest result from `get2DLiveResult()` 
   - Create animation for result reveal
   - Update every draw cycle

## 🧪 Testing Checklist

- [ ] Component renders without errors
- [ ] User info loads on mount
- [ ] Bet sessions fetch and display correctly
- [ ] Pending sessions separate from completed sessions
- [ ] Countdown timer visible
- [ ] Bet button disabled when closed/not logged in
- [ ] Auto-refresh triggers every 30 seconds
- [ ] Error messages display properly
- [ ] Navigation to bet page works

## 📚 Vue2 Original Reference

Files from `Frontend_Master9`:
- `src/components/template01/lotteryTwoHome.vue` - Vue template
- `src/store/lottery2D.js` - Vuex store definition
- `src/tools/method/lottery2D.js` - API service methods

All key patterns have been ported to React + TypeScript + Zustand.
