export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                // 1. Layout: Center alignment with consistent vertical/horizontal breathing room
                'inline-flex items-center justify-center px-8 py-4 ' +
                // 2. Shape & Branding: Signature 2xl rounding and Indigo brand color
                'rounded-2xl bg-indigo-600 border border-transparent ' +
                // 3. Typography: Clean bold text, removing the uppercase for a more friendly SaaS feel
                'text-sm font-bold text-white tracking-tight ' +
                // 4. Effects: Soft shadow that matches the Indigo hue
                'shadow-lg shadow-indigo-200 ' +
                // 5. Interaction: Scale-down on click and brighter hover state
                'transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-300 ' +
                'active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ' +
                // 6. Disabled Logic
                'disabled:opacity-50 disabled:cursor-not-allowed ' +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}