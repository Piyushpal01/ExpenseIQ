// This component renders API States(Loading / Error) and Categories grid

import CategoryCard from "./CategoryCard";
import CategoryError from "./CategoryError";
import CategorySkeleton from "./CategorySkeleton";

const CategoryList = ({ categories, isPending, isError, error, refetch, onEdit }) => {
    // Loading state
    if (isPending) {
        return <CategorySkeleton />
    }

    // Error state - render category error component
    if (isError) {
        return <CategoryError />
    }

    // Empty state
    if (!categories?.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-800/20 p-12 text-center">
                <div className="text-4xl mb-4 opacity-50">📂</div>
                <h3 className="text-xl font-semibold text-gray-200">No categories found</h3>
                <p className="mt-2 text-sm text-gray-400">
                    Create income or expense categories to organize your transactions.
                </p>
            </div>
        )
    }

    // Success state - Grid render
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 category-list-container">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className="category-card-wrapper"
                >
                    <CategoryCard category={category} onEdit={onEdit} />
                </div>
            ))}
        </div>
    )
}

export default CategoryList