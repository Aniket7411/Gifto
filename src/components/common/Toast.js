import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <FaTimesCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <FaExclamationTriangle className="w-5 h-5 text-yellow-500" />;
            default:
                return <FaInfoCircle className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px] max-w-md`}
        >
            {getIcon()}
            <p className="flex-1 text-gray-800 font-medium">{message}</p>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
            >
                ×
            </button>
        </motion.div>
    );
};

export default Toast;

