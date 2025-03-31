'use client';

/**
 * Pagination component for search results
 * @param {Object} props
 * @param {number} props.total - Total number of results
 * @param {number} props.page - Current page number
 * @param {(page: number) => void} props.setPage - Function to set the current page
 * @param {number} [props.pageSize=10] - Number of items per page
 */
export default function Pagination({ total, page, setPage, pageSize = 10 }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <nav role="navigation" aria-label="Search results pagination">
      <div className="flex justify-between items-center mt-6 select-none">
        <button
          onClick={() => setPage(page - 1)}
          onKeyDown={(e) => handleKeyDown(e, () => setPage(page - 1))}
          disabled={page <= 1}
          aria-label={`Go to previous page${page <= 1 ? ' (disabled)' : ''}`}
          className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          Previous
        </button>
        <div 
          className="text-sm text-gray-400"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">Currently on</span>
          Page {page} of {totalPages}
        </div>
        <button
          onClick={() => setPage(page + 1)}
          onKeyDown={(e) => handleKeyDown(e, () => setPage(page + 1))}
          disabled={page >= totalPages}
          aria-label={`Go to next page${page >= totalPages ? ' (disabled)' : ''}`}
          className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
