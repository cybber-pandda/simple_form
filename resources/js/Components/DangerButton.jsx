export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                // 1. Layout: Matching our Primary and Secondary button heights
                'inline-flex items-center justify-center px-8 py-4 ' +
                // 2. Shape & Branding: 2xl rounding and a modern Rose palette
                'rounded-2xl bg-rose-500 border border-transparent ' +
                // 3. Typography: Bold and readable, ditching the uppercase
                'text-sm font-bold text-white tracking-tight ' +
                // 4. Effects: Colored shadow to give it depth
                'shadow-lg shadow-rose-100 ' +
                // 5. Interaction: Scale-down click effect and smoother hover transitions
                'transition-all duration-200 hover:bg-rose-600 hover:shadow-rose-200 ' +
                'active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ' +
                // 6. Disabled state
                'disabled:opacity-50 disabled:cursor-not-allowed ' +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}