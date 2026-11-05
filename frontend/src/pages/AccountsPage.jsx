// Accounts page that displays the listing and renders the Form within a Modal.

import { useEffect, useRef, useState } from 'react'
import { useAccounts } from '../features/accounts/hooks/useAccounts'
import AccountList from '../features/accounts/components/AccountList'
import AccountForm from '../features/accounts/components/AccountForm'
import Modal from '../components/ui/Modal'
import gsap from 'gsap'
import { accountTypeOptions } from '../features/accounts/utils/accountHelpers'

const AccountsPage = () => {
    const { data: accounts = [], isPending, isError, error, refetch } = useAccounts();
    const pageRef = useRef(null);

    // States to track modal visibility and the active account instance being edited
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState(null)

    // States for Search & Filter
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('ALL')

    // GSAP Entrance Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading and stats animation
            gsap.fromTo('.header-animate',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );

            // We will animate the cards inside AccountList only when they are not pending
            if (!isPending && !isError) {
                gsap.fromTo('.account-card-wrapper',
                    { y: 30, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.2)', delay: 0.1 }
                );
            }
        }, pageRef);

        return () => ctx.revert();
    }, [isPending, isError, accounts.length]); // Re-run animation when data changes

    // Stats calculation (Optional: later we can move this to a custom hook or memo)
    const activeAccounts = accounts.filter(acc => acc.is_active !== false);
    const totalBalance = activeAccounts.reduce((sum, acc) => sum + (Number(acc.acc_balance) || 0), 0);

    // search & filter logic
    const filteredAccounts = accounts.filter(acc => {
        // search by name
        const matchesSearch = acc.acc_name.toLowerCase().includes(searchTerm.toLowerCase())
        // filter by type
        const matchesType = typeFilter === 'ALL' || acc.acc_type === typeFilter
        return matchesSearch && matchesType
    })

    // handler to open / close Modal
    const openModalForCreate = () => {
        setEditingAccount(null);    // as for adding form, initialData will be null
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setEditingAccount(null), 300);     // reset data, after animation ends 
    }

    // Edit handler
    const handleEdit = (account) => {
        setEditingAccount(account)
        setIsModalOpen(true)    // opened modal
    }

    return (
        <main ref={pageRef} className="min-h-screen bg-[#0A0A0A] text-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-7xl">

                {/* Header & Stats */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 header-animate">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                            My Accounts
                        </h1>
                        <p className="mt-2 text-sm text-gray-400 max-w-md">
                            Manage your bank accounts, wallets, and cash flow in one place.
                        </p>
                    </div>

                    {!isPending && !isError && activeAccounts.length > 0 && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex gap-8 items-center backdrop-blur-md">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Total Balance</p>
                                <p className="text-xl font-bold text-gray-100">
                                    ₹{totalBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-gray-700"></div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Active Accounts</p>
                                <p className="text-xl font-bold text-gray-100">{activeAccounts.length}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toolbar: Search, Filter, and Add Button */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center header-animate">

                    {/* Search & Filter Group */}
                    <div className="flex flex-1 w-full sm:w-auto gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-xs">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search accounts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="ALL">All Types</option>
                            {accountTypeOptions.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Add Account Button */}
                    <button
                        onClick={openModalForCreate}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] shrink-0 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Account
                    </button>
                </div>

                {/* Account List Component (Ab hum filteredAccounts pass kar rahe hain) */}
                <div className="header-animate">
                    <AccountList
                        accounts={filteredAccounts}
                        isPending={isPending}
                        isError={isError}
                        error={error}
                        refetch={refetch}
                        onEdit={handleEdit}
                    />
                </div>

            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AccountForm
                    initialData={editingAccount}
                    onSuccess={closeModal}
                    onCancel={closeModal}
                />
            </Modal>
        </main>
    )
}

export default AccountsPage;