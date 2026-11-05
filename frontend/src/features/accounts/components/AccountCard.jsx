import { useDeactivateAccount } from '../hooks/useAccounts';

const AccountCard = ({ account, onEdit }) => {
  const deactivateMutation = useDeactivateAccount();

  const getAccountIcon = (type) => {
    const icons = {
      BANK: '🏦',
      CASH: '💵',
      UPI: '📱',
      CREDIT_CARD: '💳',
      OTHER: '📂'
    };
    return icons[type] || icons.OTHER; // Account types ke liye icons[cite: 1]
  }

  // confirmation before deactivation
  const handleDeactivate = () => {
    if(window.confirm(`Are you sure you want to deactivate ${account.acc_name}?`)) {
      deactivateMutation.mutate(account.id)
    }
  }

  return (
    <div className="relative group p-6 rounded-2xl bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
      <div className="flex justify-between items-start mb-4">
        
        <div className="flex items-center gap-3">
          <span className="text-3xl bg-gray-800/80 p-3 rounded-xl border border-gray-700">
            {getAccountIcon(account.acc_type)}
          </span>

          <div>
            <h3 className="text-xl font-semibold text-gray-100 tracking-wide">{account.acc_name}</h3>
            <p className="text-sm text-gray-400 font-medium">{account.acc_type}</p>
          </div>
        </div>

        <div className="relative">
          {/* Menu button placeholder */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-1">Current Balance</p> {/* Current account balance display[cite: 1] */}
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
          ₹{(Number(account?.acc_balance) || 0).toLocaleString('en-IN')}
        </p>
      </div>

      <div className="mt-6 flex gap-3 opacity-100 transition-opacity duration-300">
        <button
          onClick={() => onEdit(account)}
          className="flex-1 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors text-sm font-medium cursor-pointer"
        >
          Edit
        </button>
        
        <button
          onClick={handleDeactivate}
          className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors text-sm font-medium cursor-pointer"
        >
          {deactivateMutation.isPending ? 'Wait...' : 'Deactivate'}
        </button>
      </div>
    </div>
  );
};

export default AccountCard;