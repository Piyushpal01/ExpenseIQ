// features/accounts/components/AccountList.jsx
import AccountCard from './AccountCard'
import AccountSkeleton from './AccountSkeleton';
import AccountError from './AccountError';

const AccountList = ({ accounts, isPending, isError, error, refetch, onEdit }) => {
    // handle loading
    if (isPending) {
        return <AccountSkeleton />
    } 

    // handle error
    if (isError) {
        return <AccountError error={error} onRetry={refetch} />
    } 

    // only filter activated accounts
    const activeAccounts = accounts.filter(acc => acc.is_active !== false);

    // Empty state
    if (!activeAccounts.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-800/20 p-12 text-center">
                <div className="text-4xl mb-4 opacity-50">🏦</div>
                <h3 className="text-xl font-semibold text-gray-200">No active accounts yet</h3>
                <p className="mt-2 text-sm text-gray-400">
                    Add your first bank, cash, or UPI account to track your expenses.
                </p>
            </div>
        );
    }

    // Success State: show Account grid
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 account-list-container">
            {activeAccounts.map((account) => (
                <div key={account.id} className="account-card-wrapper">
                    <AccountCard account={account} onEdit={onEdit} />
                </div>
            ))}
        </div>
    );
};

export default AccountList;