export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                // 1. Layout: Matching the height and feel of our primary inputs
                'inline-flex items-center justify-center px-6 py-3 ' +
                // 2. Shape & Border: 2xl rounding and a subtle slate border
                'rounded-2xl border border-slate-200 bg-white ' +
                // 3. Typography: Moving away from tiny uppercase to a clean, bold weight
                'text-sm font-bold text-slate-600 tracking-tight ' +
                // 4. Interaction: Soft hover and scale-down effect on click
                'transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 ' +
                'active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-200 ' +
                // 5. Disabled state
                'disabled:opacity-50 disabled:cursor-not-allowed ' +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}