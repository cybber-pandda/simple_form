import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function PublicView({ form }) {
    const { props } = usePage();
    const [submitted, setSubmitted] = useState(false);

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
        post(route('forms.submit', form.slug), {
            onSuccess: () => setSubmitted(true),
        });
    };

    const handleAnswerChange = (fieldId, value) => {
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[3rem] shadow-xl p-12 max-w-lg text-center border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Thank you!</h1>
                    <p className="text-slate-500 font-medium">Your response for <strong>{form.title}</strong> has been submitted successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <Head title={form.title} />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-[3rem] shadow-xl p-8 sm:p-12 border border-slate-100">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">{form.title}</h1>
                    <p className="text-slate-400 font-medium mb-10 ml-1">Please fill out the details below.</p>

                    <form onSubmit={submit} className="space-y-10">
                        {form.schema.map((field) => (
                            <div key={field.id} className="space-y-4">
                                <label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={data.data[field.id]}
                                        onChange={e => handleAnswerChange(field.id, e.target.value)}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium min-h-[120px]"
                                        required={field.required}
                                    />
                                ) : field.type === 'dropdown' ? (
                                    /* DROPDOWN LOGIC ADDED HERE */
                                    <select
                                        value={data.data[field.id]}
                                        onChange={e => handleAnswerChange(field.id, e.target.value)}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                        required={field.required}
                                    >
                                        <option value="">Select an option</option>
                                        {field.options.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : ['radio', 'checkbox'].includes(field.type) ? (
                                    <div className="grid gap-3">
                                        {field.options.map((option, idx) => (
                                            <label 
                                                key={idx} 
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                                    (field.type === 'radio' ? data.data[field.id] === option : data.data[field.id].includes(option))
                                                    ? 'border-indigo-600 bg-indigo-50/30'
                                                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                                                }`}
                                            >
                                                <input
                                                    type={field.type}
                                                    name={field.id.toString()}
                                                    checked={field.type === 'radio' ? data.data[field.id] === option : data.data[field.id].includes(option)}
                                                    onChange={e => {
                                                        if (field.type === 'radio') {
                                                            handleAnswerChange(field.id, option);
                                                        } else {
                                                            handleCheckboxChange(field.id, option, e.target.checked);
                                                        }
                                                    }}
                                                    className={`w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 ${field.type === 'radio' ? 'rounded-full' : 'rounded-md'}`}
                                                    required={field.required && field.type === 'radio' && !data.data[field.id]}
                                                />
                                                <span className="font-bold text-slate-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={data.data[field.id]}
                                        onChange={e => handleAnswerChange(field.id, e.target.value)}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                        placeholder={`Your answer...`}
                                        required={field.required}
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            disabled={processing}
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                        >
                            {processing ? 'Submitting...' : 'Submit Response'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}