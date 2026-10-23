### React Stack that we will use initially
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

### Hum use karenge:
- **React Router** — Login, Register aur Dashboard pages ke beech navigation.
- **Axios** — Django REST APIs call karne ke liye.
- **TanStack Query** — API data, loading/error states aur refetching manage karne ke liye.
- **Tailwind CSS** — responsive UI design.
- **React Context** — authentication state ke liye, jab auth flow implement karenge.

### Frontend architecture
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

### Each Folder Purpose:
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