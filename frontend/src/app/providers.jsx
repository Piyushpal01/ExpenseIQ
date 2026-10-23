import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

// Global cache and req engine config
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data remains fresh for 30s, prevents instant duplicate api hits
            staleTime: 30_000,
            
            // Auto-retry failed query only once before throwing error
            retry: 1,
            
            // stops auto-fetching when user switches tabs
            refetchOnWindowFocus: false
        },
    },
})

// Central wrapper supplying query caching context to the entire app
export default function Providers({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}