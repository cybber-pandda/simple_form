import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
    PlusIcon, TrashIcon, XMarkIcon, PaperAirplaneIcon,
    CheckIcon, ClipboardIcon, CloudArrowUpIcon, DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

export default function Builder({ form = null }) {
    const { props } = usePage();

    const { data, setData, post, put, processing } = useForm({
        id: form?.id || null,
        title: form?.title || '',
        schema: form?.schema || [],
    });

    const [generatedUrl, setGeneratedUrl] = useState(null);
    const [copied, setCopied] = useState(false);
    const [titleError, setTitleError] = useState(false);

    useEffect(() => {
        if (props.flash?.id) {
            setData('id', props.flash.id);
        }

        if (props.flash?.slug) {
            const url = `${window.location.origin}/f/${props.flash.slug}`;
            setGeneratedUrl(url);
        }
    }, [props.flash]);

    const addField = (type) => {
        const needsOptions = ['radio', 'checkbox', 'dropdown'].includes(type);
        const newField = {
            id: Date.now(),
            type: type,
            label: 'Untitled Question',
            options: needsOptions ? ['Option 1'] : [],
            required: false,
        };
        setData('schema', [...data.schema, newField]);
    };

    const duplicateField = (field) => {
        const newField = {
            ...field,
            id: Date.now() + Math.random(), // Ensure unique ID even if clicked rapidly
        };

        // Find the index of the original field to insert the duplicate right after it
        const index = data.schema.findIndex(f => f.id === field.id);
        const newSchema = [...data.schema];
        newSchema.splice(index + 1, 0, newField);

        setData('schema', newSchema);
    };

    const updateField = (id, key, value) => {
        setData('schema', data.schema.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const manageOption = (fieldId, action, index = null, value = '') => {
        setData('schema', data.schema.map(f => {
            if (f.id !== fieldId) return f;
            let newOptions = [...f.options];
            if (action === 'add') newOptions.push(`Option ${newOptions.length + 1}`);
            if (action === 'update') newOptions[index] = value;
            if (action === 'remove' && newOptions.length > 1) newOptions.splice(index, 1);
            return { ...f, options: newOptions };
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        if (!data.title.trim()) {
            setTitleError(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setTitleError(false);

        if (data.id) {
            put(route('forms.update', data.id), {
                preserveScroll: true,
                onBefore: () => setGeneratedUrl(null),
            });
        } else {
            post(route('forms.store'), {
                preserveScroll: true,
                onBefore: () => setGeneratedUrl(null),
            });
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AuthenticatedLayout header={data.id ? "Edit Form" : "Create Form"}>
            <Head title="Form Builder" />

            <form onSubmit={submit} className="py-12 max-w-4xl mx-auto space-y-6 pb-24 px-4">

                {/* Form Title Card */}
                <div className={`bg-white p-6 rounded-xl border-t-[10px] shadow-sm transition-colors ${titleError ? 'border-red-500' : 'border-indigo-700'
                    }`}>
                    <input
                        className="w-full text-3xl font-bold border-none border-b-2 border-transparent focus:border-slate-100 focus:ring-0 p-0 placeholder-slate-300"
                        placeholder="Untitled Form"
                        value={data.title}
                        onChange={e => {
                            setData('title', e.target.value);
                            if (e.target.value.trim()) setTitleError(false);
                        }}
                    />
                    {titleError && (
                        <p className="mt-2 text-sm text-red-600 font-semibold animate-pulse">
                            Please provide a form title before publishing.
                        </p>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Questions Column */}
                    <div className="flex-1 space-y-4">
                        {data.schema.map((field) => (
                            <div key={field.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group transition-all hover:shadow-md">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap gap-4">
                                        <input
                                            className="flex-[2] min-w-[250px] bg-slate-50 border-none border-b-2 border-transparent focus:border-indigo-600 focus:ring-0 font-medium p-4 rounded-t-lg transition-all"
                                            value={field.label}
                                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                                            placeholder="Question"
                                        />
                                        <select
                                            value={field.type}
                                            onChange={(e) => updateField(field.id, 'type', e.target.value)}
                                            className="flex-1 min-w-[150px] rounded-lg border-slate-200 text-sm font-medium focus:ring-indigo-500"
                                        >
                                            <option value="text">Short answer</option>
                                            <option value="textarea">Paragraph</option>
                                            <option value="radio">Multiple choice</option>
                                            <option value="checkbox">Checkboxes</option>
                                            <option value="dropdown">Dropdown</option>
                                            <option value="date">Date</option>
                                            <option value="time">Time</option>
                                        </select>
                                    </div>

                                    <div className="pl-2">
                                        {['radio', 'checkbox', 'dropdown'].includes(field.type) ? (
                                            <div className="space-y-2">
                                                {field.options.map((opt, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 group/opt">
                                                        <ChoiceIcon type={field.type} />
                                                        <input
                                                            className="flex-1 border-none border-b border-slate-100 focus:border-indigo-500 focus:ring-0 py-1 text-sm"
                                                            value={opt}
                                                            onChange={(e) => manageOption(field.id, 'update', idx, e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => manageOption(field.id, 'remove', idx)}
                                                            className="opacity-0 group-hover/opt:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                                                        >
                                                            <XMarkIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => manageOption(field.id, 'add')}
                                                    className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors pl-8 mt-2"
                                                >
                                                    + Add option
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="py-2 border-b border-dotted border-slate-300 text-slate-400 text-sm italic capitalize">
                                                User will provide {field.type} response
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-4">
                                    {/* Duplicate Button */}
                                    <button
                                        type="button"
                                        onClick={() => duplicateField(field)}
                                        className="text-slate-500 hover:text-indigo-600 transition-colors p-1"
                                        title="Duplicate"
                                    >
                                        <DocumentDuplicateIcon className="w-5 h-5" />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => setData('schema', data.schema.filter(f => f.id !== field.id))}
                                        className="text-slate-500 hover:text-red-600 transition-colors p-1"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>

                                    <div className="h-6 w-[1px] bg-slate-200" />

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-slate-600 font-medium">Required</span>
                                        <button
                                            type="button"
                                            onClick={() => updateField(field.id, 'required', !field.required)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${field.required ? 'bg-indigo-600' : 'bg-slate-200'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${field.required ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="w-full md:w-14 sticky top-6 h-fit space-y-2 bg-white p-2 rounded-xl shadow-lg border border-slate-200 flex flex-row md:flex-col items-center justify-center">
                        <button
                            type="button"
                            onClick={() => addField('radio')}
                            className="p-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all"
                        >
                            <PlusIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Submit Floating Button */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        type="submit"
                        disabled={processing || data.schema.length === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-white ${data.id ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {data.id ? (
                            <>
                                <CloudArrowUpIcon className="w-6 h-6" />
                                <span className="font-bold">Save Changes</span>
                            </>
                        ) : (
                            <>
                                <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                                <span className="font-bold">Publish Form</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {generatedUrl && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    {/* Adjusted max-width and padding for better mobile feel */}
                    <div className="bg-white rounded-[1.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl transition-all">
                        <div className="mb-4">
                            <h3 className="text-xl md:text-2xl font-black text-slate-800">
                                {data.id ? 'Changes Saved!' : 'Form Published!'}
                            </h3>
                        </div>

                        <p className="text-slate-500 mb-3 text-sm md:text-base font-medium">Link to share with respondents:</p>

                        {/* Flex-col on mobile, flex-row on tablet+ */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 mb-6">
                            <input
                                readOnly
                                value={generatedUrl}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-indigo-600 truncate mb-2 sm:mb-0"
                            />
                            <button
                                onClick={copyToClipboard}
                                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <CheckIcon className="w-4 h-4" />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <ClipboardIcon className="w-4 h-4" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            onClick={() => router.visit(route('dashboard'))}
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function ChoiceIcon({ type }) {
    if (type === 'radio') return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />;
    if (type === 'checkbox') return <div className="w-5 h-5 rounded border-2 border-slate-300" />;
    return <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-400">•</div>;
}