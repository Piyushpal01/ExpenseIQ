### 1. React Stack that we will use initially
```text
React
   ↓
Vite
   ↓
JavaScript
   ↓
React Router
   ↓
Axios
   ↓
React Query
   ↓
Tailwind CSS
```
#### Why this stack?

* **Vite** → fast modern React setup
* **React** Router → page/protected-route navigation
* **Axios** → Django API communication
* **TanStack Query** → server state, caching, refetching
* **Tailwind** → UI styling
* **Context** → sirf auth/global client state where useful; server data Context mein nahi bharna

Aur hum Redux abhi nahi lagayenge. Project ko unnecessarily complex nahi karna.

### 2. Hum use karenge:
- **React Router** — Login, Register aur Dashboard pages ke beech navigation.
- **Axios** — Django REST APIs call karne ke liye.
- **TanStack Query** — API data, loading/error states aur refetching manage karne ke liye.
- **Tailwind CSS** — responsive UI design.
- **React Context** — authentication state ke liye, jab auth flow implement karenge.

### 3. Frontend architecture
```text
src/
├── api/
│   └── client.js
├── app/
│   └── providers.jsx
├── assets/
├── components/
│   └── ui/
├── features/
│   ├── auth/
│   ├── accounts/
│   ├── categories/
│   ├── income/
│   ├── expense/
│   └── dashboard/
├── layouts/
├── pages/
├── routes/
├── hooks/
├── utils/
├── App.jsx
├── index.css
└── main.jsx
```

### 4. Each Folder Purpose:
| Folder | Responsibility |
| :--- | :--- |
| `api/` | Axios client aur API configuration |
| `app/` | Global providers, jaise React Query |
| `components/ui/` | Reusable buttons, inputs, modals |
| `features/` | Feature-specific components, hooks aur logic |
| `layouts/` | Common page layouts |
| `pages/` | Login, Register, Dashboard jaise pages |
| `routes/` | Route definitions aur protected routes |
| `hooks/` | Shared custom React hooks |
| `utils/` | Formatting aur helper functions |

> TanStack Query: API request ke result, loading aur error ko manage karta hai. Har baar manually useState aur useEffect likhne ki zaroorat kam hoti hai.

### REACT Flow
```text
DashboardPage.jsx
   ↓
Dashboard screen ka React component
   ↓
TanStack Query
   ↓
API data fetch, loading/error state aur caching
   ↓
Axios → Django API
   ↓
GET /api/dashboard/ + access token
   ↓
Dashboard UI
   ↓
Income, expenses, balances, accounts aur transactions
```

* **useDashboard.js** — API request aur data fetching.
* **DashboardPage.jsx** — data ko screen par display karna.

### 5. Made Auth Roubust
1. **Current implementation review:** AuthContext.jsx, api/client.js, ProtectedRoute.jsx aur backend ke JWT settings/endpoints samjhenge.
2. **Session restoration:** page refresh karne par user unnecessarily login screen par na pahunche.
3. **Access-token refresh:** access token expire ho toh refresh token se naya access token lene ka flow.
4. **Axios interceptors:** API requests mein token attach karna, 401 response handle karna aur eligible request ko retry karna.
5. **Race conditions:** ek saath multiple requests fail hon toh multiple refresh requests aur infinite retry loops se bachna.
6. **Logout handling:** backend refresh-token blacklist, frontend state cleanup aur query-cache cleanup ko properly coordinate karna.
7. **Protected routes and loading states:** session verify hone tak galat redirect ya dashboard ka flicker na ho.
8. **Testing and Git:** expired token, reload, logout, failed refresh aur normal login ke scenarios test karke milestone commit karna.

### 6. Axios Interceptors & Automatic Token Refresh
#### Is step mein kya banayenge?
1. **Automatic access-token refresh:** Protected API request par 401 aaye toh refresh endpoint call karke naya access token lena.
2. **Original request retry:** Naya token milne par failed request ko ek baar retry karna, infinite loop nahi.
3. **Concurrent requests:** Agar ek saath 4 requests fail hoti hain, toh ideally ek hi refresh request chale aur baaki uska result wait karein.
4. **Refresh failure:** Refresh token invalid/expired ho toh session safely clear karna, bina recursive refresh attempts ke.

### 7. Phases that are added later on
* **Phase 1 — Authentication Hardening & Session Management**
*  **Phase 2 — Financial Dashboard & Analytics**
*  

#### Phase 2 — Financial Dashboard & Analytics
1. **Dashboard Audit**
   | Feature | Status |
   | :--- | :--- |
   | Dashboard API integration | Complete |
   | TanStack Query | Complete |
   | Total Income card | Complete |
   | Total Expenses card | Complete |
   | Net Balance card | Complete |
   | Account Balance card | Complete |
   | Accounts listing | Complete |
   | Recent Transactions | Complete |
   | Loading skeleton | Complete |
   | Error state + retry | Complete |
   | GSAP entry animations | Complete |

2. **Calculation / Analytics that we can keep for dashboard**
   | Analytics | Calculation source |
   | :--- | :--- |
   | Total Income | Income amount sum |
   | Total Expenses | Expense amount sum |
   | Net Cash Flow | Income − Expenses |
   | Total Account Balance | Account balance sum |
   | Income Change % | Current vs previous period |
   | Expense Change % | Current vs previous period |
   | Monthly Income Trend | Income grouped by month |
   | Monthly Expense Trend | Expense grouped by month |
   | Expense Category Breakdown | Expense grouped by category |
   | Recent Transactions | Income + Expense records |

   *Net Cash Flow selected period ka income minus expense hoga. Total Account Balance current account balances ka snapshot hoga. Date filter change karne se ye change nahi hona chahiye.*

3. **Building Account Management Module**
   * Functionality
     | Feature | Functionality |
     | :--- | :--- |
     | **Accounts List** | User ke saare accounts display |
     | **Add Account** | Naya bank/cash/UPI account |
     | **Edit Account** | Name aur account details update |
     | **Deactivate Account** | Account ko inactive karna |
     | **Balance Display** | Current account balance |
     | **Empty State** | Account na hone par helpful UI |
     | **Loading/Error** | Proper API states |
   * Account Types => Bank, Cash, UPI, Card, other
   
### Files and their implemented functionalities
#### AccountForm.jsx
- Add Account
- Edit Account
- Form validation
- Account type selection
- API error handling
- Loading/submission state

#### accountHelpers.js - keep reusable helpers
- Account type labels.
- Account icons.
- Currency formatting.
- Account-related display utilities. 

#### AuthContext.jsx
| Functionality | Status |
| :--- | :--- |
| Login with JWT | Implemented |
| Register | Implemented |
| Logout | Implemented |
| Access token in memory | Implemented |
| Refresh token in sessionStorage | Implemented |
| Session restoration | Implemented |
| User profile restoration | Implemented |
| Session expiration event | Implemented |
| Context value memoization | Implemented |
