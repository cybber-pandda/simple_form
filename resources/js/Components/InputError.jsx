import { motion, AnimatePresence } from 'framer-motion';

export default function InputError({ message, className = '', ...props }) {
    return (
        <AnimatePresence>
            {message && (
                <motion.p
                    {...props}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={
                        // 1. Typography: Small, bold, and slightly tightened
                        'text-[12px] font-bold tracking-tight ' +
                        // 2. Color: A sophisticated rose-red, not too harsh
                        'text-rose-500 mt-2 ml-1 ' +
                        className
                    }
                >
                    <span className="inline-flex items-center gap-1">
                        {/* Adding a small dot or icon makes it more scannable */}
                        <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                        {message}
                    </span>
                </motion.p>
            )}
        </AnimatePresence>
    );
}