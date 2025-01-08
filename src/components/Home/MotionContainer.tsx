'use client'
import { motion } from "framer-motion";

const MotionContainer = ({ children, className, delay=0.5 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default MotionContainer;