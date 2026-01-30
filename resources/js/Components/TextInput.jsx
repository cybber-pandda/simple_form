import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eye, EyeOff, Check, Circle } from 'lucide-react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, showStrength = false, onValidationChange, icon: Icon, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    
    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    // Validation Rules
    const value = props.value || '';
    const rules = [
        { label: '8+ characters', test: value.length >= 8 },
        { label: 'At least one number', test: /[0-9]/.test(value) },
        { label: 'One special character', test: /[^A-Za-z0-9]/.test(value) },
        { label: 'One uppercase letter', test: /[A-Z]/.test(value) },
    ];

    const allPassed = rules.every(rule => rule.test);

    useEffect(() => {
        if (isPassword && onValidationChange) {
            onValidationChange(allPassed);
        }
    }, [allPassed, isPassword]);

    return (
        <div className="w-full">
            <div className="relative w-full group">
                {Icon && (
                    <Icon 
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-20 pointer-events-none" 
                        size={18} 
                    />
                )}

                <input
                    {...props}
                    type={inputType}
                    className={
                        'w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl ' +
                        'focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all duration-200 outline-none ' +
                        'text-slate-700 placeholder:text-slate-300 py-4 ' +
                        (Icon ? 'pl-14 ' : 'px-5 ') +
                        (isPassword ? 'pr-14 ' : 'pr-5 ') +
                        className
                    }
                    ref={localRef}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none z-20"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {/* Security Requirements Checklist - Strict 2x2 Grid */}
            {isPassword && showStrength && value.length > 0 && (
                <div className="mt-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-top-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                        Security Requirements
                    </p>
                    {/* Fixed 2 columns on all screens for exactly 2 rows */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        {rules.map((rule, index) => (
                            <div key={index} className="flex items-center gap-2 px-1">
                                {rule.test ? (
                                    <div className="bg-emerald-500 rounded-full p-0.5 shrink-0">
                                        <Check size={8} className="text-white" strokeWidth={4} />
                                    </div>
                                ) : (
                                    <div className="bg-slate-200 rounded-full p-0.5 shrink-0">
                                        <Circle size={8} className="text-slate-200" fill="currentColor" />
                                    </div>
                                )}
                                <span className={`text-[9px] sm:text-[10px] font-bold truncate ${rule.test ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {rule.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});