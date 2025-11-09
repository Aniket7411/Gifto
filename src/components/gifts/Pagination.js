import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
  totalItems,
  itemsPerPage
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="bg-black/60 border border-red-900/40 rounded-2xl shadow-[0_20px_35px_rgba(220,38,38,0.2)] p-6 text-red-100">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div className="text-sm text-red-200/80 mb-4 sm:mb-0">
          Showing {startItem} to {endItem} of {totalItems} gifts
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-red-200/80">per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onPageChange(1, parseInt(e.target.value, 10))}
            className="px-3 py-1 border border-red-900/40 bg-black/50 text-red-100 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
            <option value={96}>96</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <motion.button
          onClick={() => hasPrev && onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            hasPrev
              ? 'bg-red-600 text-white hover:bg-red-500 transform hover:scale-105 shadow-lg'
              : 'bg-gray-700/40 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={hasPrev ? { scale: 1.05 } : {}}
          whileTap={hasPrev ? { scale: 0.95 } : {}}
        >
          <FaChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </motion.button>

        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-red-300/70">
                  <FaEllipsisH className="w-4 h-4" />
                </span>
              ) : (
                <motion.button
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    page === currentPage
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-black/50 border border-red-900/40 text-red-100 hover:bg-red-600/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.button
          onClick={() => hasNext && onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            hasNext
              ? 'bg-red-600 text-white hover:bg-red-500 transform hover:scale-105 shadow-lg'
              : 'bg-gray-700/40 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={hasNext ? { scale: 1.05 } : {}}
          whileTap={hasNext ? { scale: 0.95 } : {}}
        >
          <span className="hidden sm:inline">Next</span>
          <FaChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-2">
        <span className="text-sm text-red-200/80">Jump to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value, 10);
            if (page >= 1 && page <= totalPages) {
              onPageChange(page);
            }
          }}
          className="w-16 px-2 py-1 border border-red-900/40 rounded-md bg-black/40 text-red-100 text-sm text-center focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <span className="text-sm text-red-200/80">of {totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;

