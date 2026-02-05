import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState, useRef } from 'react';

export default function PublicView({ form }) {
    const { props } = usePage();
    const [submitted, setSubmitted] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    
    // Create a ref object to store references to each question element
    const questionRefs = useRef({});

    // Initialize the answers object
    const initialAnswers = {};
    form.schema.forEach(field => {
        initialAnswers[field.id] = field.type === 'checkbox' ? [] : '';
    });

    const { data, setData, post, processing, errors } = useForm({
        data: initialAnswers 
    });

    const submit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        let firstErrorId = null;

        // Validation logic
        form.schema.forEach(field => {
            let hasError = false;

            // Checkbox specific validation
            if (field.type === 'checkbox' && field.required) {
                const selectedOptions = data.data[field.id] || [];
                if (selectedOptions.length === 0) {
                    newErrors[field.id] = "Required: Select at least one.";
                    hasError = true;
                }
            } 
            // Other fields validation (Standard required)
            else if (field.required && !data.data[field.id]) {
                newErrors[field.id] = "This field is required.";
                hasError = true;
            }

            // Capture the first error ID for scrolling
            if (hasError && !firstErrorId) {
                firstErrorId = field.id;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);

            // Auto-scroll to the first problematic question
            if (firstErrorId && questionRefs.current[firstErrorId]) {
                questionRefs.current[firstErrorId].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center' // Position the question in the center of the screen
                });
            }
            return;
        }

        // Clear local errors before final submission
        setValidationErrors({});

        post(route('forms.submit', form.slug), {
            onSuccess: () => setSubmitted(true),
        });
    };

    const handleAnswerChange = (fieldId, value) => {
        // Clear error as soon as user interacts
        if (validationErrors[fieldId]) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated[fieldId];
                return updated;
            });
        }

        setData('data', {
            ...data.data,
            [fieldId]: value
        });
    };

    const handleCheckboxChange = (fieldId, option, isChecked) => {
        const currentValues = data.data[fieldId] || [];
        const newValues = isChecked 
            ? [...currentValues, option]
            : currentValues.filter(v => v !== option);
        
        handleAnswerChange(fieldId, newValues);
    };

    if (submitted || props.flash?.message) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-xl p-8 sm:p-12 w-full max-w-lg text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Thank you!</h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium">
                        Your response for <span className="text-slate-900 font-bold">{form.title}</span> has been submitted successfully.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 sm:py-16 px-4">
            <Head title={form.title} />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-xl p-6 sm:p-14 border border-slate-100">
                    <header className="mb-10 sm:mb-12">
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-3">
                            {form.title}
                        </h1>
                        <div className="h-1.5 w-12 bg-indigo-600 rounded-full mb-4" />
                        <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest ml-1">
                            Please fill out the details below.
                        </p>
                    </header>

                    <form onSubmit={submit} className="space-y-8 sm:space-y-12">
                        {form.schema.map((field) => (
                            <div 
                                key={field.id} 
                                ref={el => questionRefs.current[field.id] = el} // Assign ref to each question container
                                className="space-y-4 scroll-mt-20"
                            >
                                <div className="flex justify-between items-end mb-1">
                                    <label className="block text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-[0.15em] ml-1">
                                        {field.label} {field.required && <span className="text-red-500 font-bold">*</span>}
                                    </label>
                                    
                                    {/* Custom Inline Warning Label */}
                                    {validationErrors[field.id] && (
                                        <span className="text-[9px] sm:text-[10px] font-bold text-red-500 uppercase tracking-wider animate-in fade-in slide-in-from-right-2">
                                            {validationErrors[field.id]}
                                        </span>
                                    )}
                                </div>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={data.data[field.id]}
                                        onChange={e => handleAnswerChange(field.id, e.target.value)}
                                        placeholder="Type your message here..."
                                        className={`w-full bg-slate-50 border-slate-100 rounded-2xl p-4 sm:p-5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium min-h-[140px] text-slate-700 placeholder:text-slate-300 ${validationErrors[field.id] ? 'ring-2 ring-red-100 border-red-200' : ''}`}
                                    />
                                ) : field.type === 'dropdown' ? (
                                    <div className="relative">
                                        <select
                                            value={data.data[field.id]}
                                            onChange={e => handleAnswerChange(field.id, e.target.value)}
                                            className={`w-full appearance-none bg-slate-50 border-slate-100 rounded-2xl p-4 sm:p-5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 ${validationErrors[field.id] ? 'ring-2 ring-red-100 border-red-200' : ''}`}
                                        >
                                            <option value="">Select an option</option>
                                            {field.options.map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : ['radio', 'checkbox'].includes(field.type) ? (
                                    <div className={`grid gap-2 sm:gap-3 p-1 rounded-2xl transition-all ${validationErrors[field.id] ? 'bg-red-50/50 ring-1 ring-red-100' : ''}`}>
                                        {field.options.map((option, idx) => {
                                            const isSelected = field.type === 'radio' 
                                                ? data.data[field.id] === option 
                                                : data.data[field.id].includes(option);
                                            
                                            return (
                                                <label 
                                                    key={idx} 
                                                    className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.99] ${
                                                        isSelected
                                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm shadow-indigo-100'
                                                            : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                                                    }`}
                                                >
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type={field.type}
                                                            name={field.id.toString()}
                                                            checked={isSelected}
                                                            onChange={e => {
                                                                if (field.type === 'radio') {
                                                                    handleAnswerChange(field.id, option);
                                                                } else {
                                                                    handleCheckboxChange(field.id, option, e.target.checked);
                                                                }
                                                            }}
                                                            className={`w-6 h-6 text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-offset-0 ${field.type === 'radio' ? 'rounded-full' : 'rounded-lg'}`}
                                                        />
                                                    </div>
                                                    <span className={`font-bold transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>
                                                        {option}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={data.data[field.id]}
                                        onChange={e => handleAnswerChange(field.id, e.target.value)}
                                        className={`w-full bg-slate-50 border-slate-100 rounded-2xl p-4 sm:p-5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-300 ${validationErrors[field.id] ? 'ring-2 ring-red-100 border-red-200' : ''}`}
                                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="pt-4">
                            <button
                                disabled={processing}
                                className="w-full bg-slate-900 text-white font-black py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] hover:bg-indigo-600 disabled:bg-slate-300 transition-all shadow-xl shadow-slate-200 active:scale-[0.97] flex items-center justify-center gap-3"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Submitting...
                                    </>
                                ) : 'Submit Response'}
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-black">
                                Secured by YourForm App
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}