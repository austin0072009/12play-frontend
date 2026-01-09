# Lottery 2D Integration - Quick Reference Card

## 🚀 Quick Start (5 minutes)

### 1. Set Lottery Credentials
```typescript
import { useLotteryStore } from '../store/lottery';

const store = useLotteryStore();
store.setLotteryCredentials(
  'lottery-token-from-api',
  'https://game.sea2d3d.com',
  'L2D'
);
```

### 2. Use in Component
```typescript
import { useLotteryStore } from '../store/lottery';

function MyComponent() {
  const { userInfo, pendingSessions, error, isLoadingSessions } = useLotteryStore();
  
  return (
    <>
      {isLoadingSessions && <Spinner />}
      {error && <Error message={error} />}
      {userInfo?.balance && <Balance amount={userInfo.balance} />}
    </>
  );
}
```

---

## 📡 API Endpoints at a Glance

| Name | Method | URL | Body |
|------|--------|-----|------|
| Get User | POST | `/api/v3/user/info` | `{}` |
| Get Sessions | POST | `/api/v3/history/session` | `{}` |
| Get 2D Result | GET | `/api/v1/2d/result` | - |
| Get Numbers | POST | `/api/v3/session/number` | `{gameId:1, issue}` |
| Place Bet | POST | `/api/v3/bet` | `{gameId:1, issue, betInfo}` |
| Get Records | POST | `/api/v3/bet/record` | `{gameId:1, page, pageSize}` |

---

## 🎯 State Management Cheat Sheet

### Get State
```typescript
const {
  lotteryToken,        // string - API token
  userInfo,           // object - user data
  pendingSessions,    // array - open draws
  completedSessions,  // array - results
  error,              // string - error msg
  isLoadingSessions,  // boolean - loading
} = useLotteryStore();
```

### Set State
```typescript
const {
  setUserInfo,           // (data) => void
  setPendingSessions,    // (array) => void
  setCompletedSessions,  // (array) => void
  setError,              // (msg) => void
  setLoadingSessions,    // (bool) => void
  clearLotterySession,   // () => void
} = useLotteryStore();
```

---

## 🎨 Component Examples

### Display User Balance
```tsx
import { useLotteryStore } from '../store/lottery';

export function BalanceDisplay() {
  const { userInfo } = useLotteryStore();
  return <div>Balance: {userInfo?.balance ?? 'N/A'}</div>;
}
```

### List Upcoming Draws
```tsx
export function UpcomingDraws() {
  const { pendingSessions } = useLotteryStore();
  
  return (
    <div>
      {pendingSessions.map(session => (
        <div key={session.issue}>
          Next: {session.win_time.split(' ')[1]}
        </div>
      ))}
    </div>
  );
}
```

### Show Latest Result
```tsx
export function LatestResult() {
  const { completedSessions } = useLotteryStore();
  const latest = completedSessions[0];
  
  return latest ? (
    <div>
      Latest: {latest.win_num} at {latest.win_time}
    </div>
  ) : null;
}
```

---

## 🔧 Common Operations

### Fetch User Info
```typescript
import { getLotteryUserInfo } from '../services/lottery';
import { useLotteryStore } from '../store/lottery';

const userInfo = await getLotteryUserInfo();
useLotteryStore().setUserInfo(userInfo);
```

### Fetch & Separate Sessions
```typescript
import { getBetSessions } from '../services/lottery';
import { useLotteryStore } from '../store/lottery';

const sessions = await getBetSessions();
const pending = sessions.filter(s => s.winState === 1);
const completed = sessions.filter(s => s.winState === 3);

const store = useLotteryStore();
store.setPendingSessions(pending);
store.setCompletedSessions(completed);
```

### Format Time Display
```typescript
function formatTime(isoString: string): string {
  const timePart = isoString.split(' ')[1];
  const [hour, minute] = timePart.split(':');
  return `${hour}:${minute}`;
}

// Usage
<p>{formatTime('2024-12-29 16:30:00.0')}</p> // Shows: 16:30
```

### Auto-Refresh Data
```typescript
useEffect(() => {
  fetchData();
  
  const interval = setInterval(fetchData, 30000); // 30 seconds
  return () => clearInterval(interval);
}, []);
```

---

## ⚠️ Common Mistakes

❌ **DON'T**
```typescript
// Forget to set token before API calls
const user = await getLotteryUserInfo(); // Will fail!

// Use state without checking
<div>{userInfo.balance}</div> // Crash if null!

// Hardcode API URL
const url = 'https://game.sea2d3d.com/api/v3/user/info';

// Ignore errors
try {
  await getLotteryUserInfo();
} catch (err) {
  // Silently fail
}
```

✅ **DO**
```typescript
// Set token first
setLotteryToken(token);
const user = await getLotteryUserInfo(); // Works!

// Check before rendering
<div>{userInfo?.balance ?? 'N/A'}</div>

// Use env variable
const url = `${import.meta.env.VITE_LOTTERY_API_BASE_URL}/api/v3/user/info`;

// Handle errors
try {
  await getLotteryUserInfo();
} catch (err) {
  setError(err.message);
}
```

---

## 🧹 Cleanup

### Clear Session on Logout
```typescript
import { useLotteryStore } from '../store/lottery';
import { clearLotteryToken } from '../utils/lotteryRequest';

function handleLogout() {
  useLotteryStore().clearLotterySession();
  clearLotteryToken();
  // ... other logout logic
}
```

---

## 🐛 Debugging

### Check Store State
```typescript
import { useLotteryStore } from '../store/lottery';

// In browser console
const state = useLotteryStore.getState();
//console.log(state);
```

### Monitor API Calls
DevTools Network Tab:
- All requests to `https://game.sea2d3d.com/api/v3/*`
- Check headers for: `Authorization: Bearer {token}`
- Check response structure

### Enable Logging
```typescript
useEffect(() => {
  const { error } = useLotteryStore();
  if (error) console.error('Lottery error:', error);
}, [useLotteryStore().error]);
```

---

## 📊 Data Structures

### User Info
```typescript
{
  balance?: number;
  username?: string;
  token?: string;
  api_domain?: string;
  // ... other fields
}
```

### Bet Session
```typescript
{
  issue: string;        // "20241229-001"
  win_time: string;     // "2024-12-29 16:30:00.0"
  set: string;          // "1,482.50"
  value: string;        // "29,083.51"
  win_num: string;      // "45" or "??"
  winState: number;     // 1 = open, 3 = drawn
}
```

### Closed Day
```typescript
{
  type: 1 | 2;          // 1 = weekday, 2 = date
  day?: number;         // 1-7 for type 1
  date?: string;        // YYYY-MM-DD for type 2
  remark?: string;      // "Weekend" etc
}
```

---

## 🎓 Learn More

| Topic | File |
|-------|------|
| Full examples | `LOTTERY_IMPLEMENTATION_GUIDE.md` |
| API details | `LOTTERY_API_INTEGRATION_REFERENCE.md` |
| What changed | `LOTTERY_2D_INTEGRATION_SUMMARY.md` |
| Is it done? | `LOTTERY_INTEGRATION_COMPLETE.md` |
| Source code | `src/pages/Lottery2DHome.tsx` |
| Store code | `src/store/lottery.ts` |

---

## 🚀 Next Steps

1. Set lottery credentials after main app login
2. Create Lottery2DBet component for betting
3. Add countdown timer implementation
4. Implement closed day API integration
5. Create bet history/records view
6. Add winners/rankings view

---

**Everything is ready. Just add credentials and go!** 🎉
