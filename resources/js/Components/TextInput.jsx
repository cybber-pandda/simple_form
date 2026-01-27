import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                // 1. Base Styles: Slate background and thick rounded corners
                'w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl ' +
                // 2. Interactive: Indigo ring on focus, smooth transition
                'focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all duration-200 outline-none ' +
                // 3. Text Styles: Slate-700 for readability, clean placeholder
                'text-slate-700 placeholder:text-slate-300 px-5 py-4 ' +
                className
            }
            ref={localRef}
        />
    );
});