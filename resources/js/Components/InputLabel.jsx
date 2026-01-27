export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                // 1. Typography: Small, bold, and slightly tighter tracking for a refined look
                'block text-[13px] font-bold leading-none ' +
                // 2. Color: Using Slate-500/600 for a softer but professional contrast
                'text-slate-500 mb-2.5 ml-1 ' +
                // 3. Spacing: Adding a slight left margin to align with the large rounded corners of our inputs
                className
            }
        >
            {value ? value : children}
        </label>
    );
}