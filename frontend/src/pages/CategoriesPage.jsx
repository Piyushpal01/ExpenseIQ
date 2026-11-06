// Main Categories dashboard that handles the list, search, filters, and modal

// Component: Categories ka main dashboard jo list, search, filters aur modal handle karta hai

import { useEffect, useRef, useState } from 'react';
import { useCategories } from '../features/categories/hooks/useCategories';
import CategoryList from '../features/categories/components/CategoryList';
import CategoryForm from '../features/categories/components/CategoryForm';
import Modal from '../components/ui/Modal';
import gsap from 'gsap';

const CategoriesPage = () => {
    // API Fetch
    const { data: categories = [], isPending, isError, error, refetch } = useCategories();
    const pageRef = useRef(null);

    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Filter & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');

    // Data Filtering Logic
    const filteredCategories = categories.filter(cat => {
        const catName = cat.category_name || ''
        const catType = (cat.category_type || '').toUpperCase()

        const matchesSearch = catName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === 'ALL' || catType === typeFilter
        return matchesSearch && matchesType;
    })

    // Stats Calculation, safe stats
    const incomeCount = categories.filter(c => (c.category_type || '').toUpperCase() === 'INCOME').length;
    const expenseCount = categories.filter(c => (c.category_type || '').toUpperCase() === 'EXPENSE').length;

    // GSAP Entrance Animation
    // 1. Initial Page Load Animation (Only for header & toolbar)
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.header-animate',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );
        }, pageRef);
        return () => ctx.revert();
    }, []);

    // 2. Cards Animation (it will triggered when list is completely loaded)
    useEffect(() => {
        if (!isPending && filteredCategories.length > 0) {
            const ctx = gsap.context(() => {
                setTimeout(() => {
                    const cards = document.querySelectorAll('.category-card-wrapper');
                    if (cards.length > 0) {
                        gsap.fromTo(cards,
                            { y: 30, opacity: 0, scale: 0.95 },
                            { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.2)' }
                        );
                    }
                }, 50); // React DOM render time
            }, pageRef);
            return () => ctx.revert();
        }
    }, [isPending, filteredCategories.length]);

    // Modal Handlers
    const openModalForCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    }

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setEditingCategory(null), 300); // Clear data after exit animation
    }

    return (
        <main ref={pageRef} className="min-h-screen bg-[#0A0A0A] text-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-7xl">
                
                {/* Header Section */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 header-animate">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-300">
                            Categories
                        </h1>

                        <p className="mt-2 text-sm text-gray-400 max-w-md">
                            Organize your transactions with custom income and expense categories.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    {!isPending && !isError && categories.length > 0 && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex gap-6 items-center backdrop-blur-md">
                            <div>
                                <p className="text-xs text-emerald-500/70 font-medium">Income Categories</p>
                                <p className="text-xl font-bold text-emerald-400">{incomeCount}</p>
                            </div>

                            <div className="w-px h-8 bg-gray-800"></div>

                            <div>
                                <p className="text-xs text-rose-500/70 font-medium">Expense Categories</p>
                                <p className="text-xl font-bold text-rose-400">{expenseCount}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toolbar: Search, Filters & Action */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center header-animate">         
                    {/* Search & Filter Controls */}
                    <div className="flex flex-1 w-full sm:w-auto gap-4">
                        
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-xs">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            </span>

                            <input 
                                type="text" 
                                placeholder="Search categories..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Type Filter */}
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="ALL">All Types</option>
                            <option value="INCOME">Income Only</option>
                            <option value="EXPENSE">Expense Only</option>
                        </select>
                    </div>

                    {/* Add Button */}
                    <button 
                        onClick={openModalForCreate}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl font-medium transition-all"
                    >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                         Add Category
                    </button>
                </div>

                {/* Grid List */}
                <div className="header-animate">
                    <CategoryList 
                        categories={filteredCategories} 
                        isPending={isPending} 
                        isError={isError} 
                        error={error} 
                        refetch={refetch}
                        onEdit={handleEdit}
                    />
                </div>

            </div>

            {/* Reusable Modal containing our Form */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <CategoryForm 
                    initialData={editingCategory} 
                    onSuccess={closeModal} 
                    onCancel={closeModal} 
                />
            </Modal>
        </main>
    )
}

export default CategoriesPage;