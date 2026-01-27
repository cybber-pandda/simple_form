export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                // 1. Shape: Moving from 'rounded' (tiny) to 'rounded-lg' for a softer profile
                'h-5 w-5 rounded-lg border-none ring-2 ring-slate-200 ' +
                // 2. Color: Premium Indigo branding
                'text-indigo-600 ' +
                // 3. Interaction: Smooth transition on check and a clean focus ring
                'transition duration-200 ease-in-out ' +
                'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ' +
                // 4. Customizing the "checked" state appearance
                'checked:bg-indigo-600 checked:ring-indigo-600 ' +
                className
            }
        />
    );
}