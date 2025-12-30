游戏API Documentation for Claude
Purpose: This document describes the 游戏API (Game API) for a 2D/3D lottery betting system. Use this to integrate with a React frontend.

Base Configuration
Property	Value
Base URL	https://game.sea2d3d.com
Content-Type	application/json
Authentication	Authorization header with token
Headers (Required for all requests)
Response Format
All API responses follow this structure:

Endpoints
1. Get Game List
获取游戏列表 GetTheGameList

Property	Value
Method	POST
URL	/api/v3/game/list
Body	{} (empty object)
Response:

TypeScript Interface:

2. Get 2D Live Result
2D Live

Property	Value
Method	GET
URL	/api/v1/2d/result
Body	None
Response:

TypeScript Interface:

3. Get User Info
获取用户信息 GetTheUserInfo

Property	Value
Method	POST
URL	/api/v3/user/info
Body	{} (empty object)
Response:

TypeScript Interface:

4. Get Game Resource (Banner & Notifications)
获取游戏资源 GetResource

Property	Value
Method	POST
URL	/api/v3/game/resource
Body	{"gameId": 1}
Request Body:

Response:

TypeScript Interface:

5. Get Bet Sessions
获取游戏场次 GetBetIssue

Property	Value
Method	POST
URL	/api/v3/history/session
Request Body:

Response (winState=1, Pending):

Response (winState=3, Completed):

TypeScript Interface:

6. Get Available Bet Numbers for a Session
获取某一期可以下注的号码 GetBetSessionAvailableBetNumbers

Property	Value
Method	POST
URL	/api/v3/session/number
Request Body:

Example Request:

Note: Use a valid issue from the pending sessions (winState=1). Invalid/expired issues return an error.

7. Place Bet
客户下注 Bet

Property	Value
Method	POST
URL	/api/v3/bet
Request Body:

Example Request:

8. Get Win Ranking for a Session
获取某一期的赢钱排行榜单 WinRanking

Property	Value
Method	POST
URL	/api/v3/rank
Request Body:

Response:

9. Get User Bet Statistics per Session
获取客户每一期的下注总额 GetUser Every BetSession Statistics

Property	Value
Method	POST
URL	/api/v3/bet/list
Request Body:

Example Request:

Response:

TypeScript Interface:

10. Get Bet Records
获取注单记录 GetBet Record

Property	Value
Method	POST
URL	/api/v3/bet/record
Request Body:

Example Request:

Response:

11. Get Daily Bet Statistics
获取每天的下注总计 Get Bet Record Daily Statistic

Property	Value
Method	POST
URL	/api/v3/record/total
Request Body:

Example Request:

Response:

TypeScript Interface:

12. Get Specific Date Bet Details
获取某一天的下注详情 Get Specific Date Bet Detail

Property	Value
Method	POST
URL	/api/v3/bet/details
Request Body:

Example Request:

Response:

13. Get Specific Date Bet Total by Session
获取某一天所有期的下注汇总 Get Specific Date Bet total statistics

Property	Value
Method	POST
URL	/api/v3/issue/total
Request Body:

Example Request:

Response:

14. Exchange Ticket for Token
根据ticket获取token

Property	Value
Method	POST
URL	/api/v1/exchange/certificates
Auth	Not required
Request Body:

Example Request:

React Integration Example
Game IDs Reference
gameId	Game Name
1	2D
2	3D
Bet States Reference
bet_state	Meaning
1	Open for betting
2	Closed/Drawn
Win States Reference (for /history/session)
winState	Meaning
1	未开奖 (Pending/Not drawn)
3	已开奖 (Completed/Drawn)