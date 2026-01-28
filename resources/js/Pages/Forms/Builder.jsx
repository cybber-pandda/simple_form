import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { PlusIcon, TrashIcon, ListBulletIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function Builder() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        schema: [], 
    });

    // 1. Updated addField to handle choice-based initialization
    const addField = (type) => {
        const isChoice = ['radio', 'checkbox'].includes(type);
        const newField = {
            id: Date.now(),
            type: type,
            label: `New ${type} question`,
            required: false,
            options: isChoice ? ['Option 1'] : [], // Choices live here
        };
        setData('schema', [...data.schema, newField]);
    };

    const removeField = (id) => {
        setData('schema', data.schema.filter(field => field.id !== id));
    };

    const updateFieldLabel = (id, newLabel) => {
        setData('schema', data.schema.map(f => f.id === id ? { ...f, label: newLabel } : f));
    };

    // 2. Choice Management Functions
    const addOption = (fieldId) => {
        setData('schema', data.schema.map(f => {
            if (f.id === fieldId) {
                return { ...f, options: [...f.options, `Option ${f.options.length + 1}`] };
            }
            return f;
        }));
    };

    const updateOption = (fieldId, index, value) => {
        setData('schema', data.schema.map(f => {
            if (f.id === fieldId) {
                const newOptions = [...f.options];
                newOptions[index] = value;
                return { ...f, options: newOptions };
            }
            return f;
        }));
    };

    const removeOption = (fieldId, index) => {
        setData('schema', data.schema.map(f => {
            if (f.id === fieldId && f.options.length > 1) {
                return { ...f, options: f.options.filter((_, i) => i !== index) };
            }
            return f;
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('forms.store'));
    };

    return (
        <AuthenticatedLayout header="Advanced Form Builder">
            <Head title="Form Builder" />

            <div className="py-12">
                <form onSubmit={submit} className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Form Title */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Form Title</label>
                        <TextInput
                            className="w-full text-2xl font-black border-none focus:ring-0 p-0"
                            placeholder="My Survey Name"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar: Toolbox */}
                        <div className="md:col-span-1 space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Input Types</p>
                            {['text', 'textarea'].map(t => (
                                <button key={t} type="button" onClick={() => addField(t)} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-500 font-bold text-sm capitalize transition-all">
                                    <PlusIcon className="w-4 h-4" /> {t}
                                </button>
                            ))}
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest my-4">Choice Types</p>
                            <button type="button" onClick={() => addField('radio')} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-500 font-bold text-sm transition-all">
                                <ListBulletIcon className="w-4 h-4 text-indigo-500" /> Multiple Choice
                            </button>
                            <button type="button" onClick={() => addField('checkbox')} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-500 font-bold text-sm transition-all">
                                <CheckIcon className="w-4 h-4 text-emerald-500" /> Checkboxes
                            </button>
                        </div>

                        {/* Main Canvas */}
                        <div className="md:col-span-3 space-y-4 min-h-[500px] bg-slate-50/50 rounded-[2.5rem] p-6 border-2 border-dashed border-slate-200">
                            {data.schema.map((field) => (
                                <div key={field.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 group">
                                    <div className="flex justify-between gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                                                className="w-full border-none focus:ring-0 font-black text-slate-800 p-0 text-lg"
                                            />
                                            <span className="text-[10px] font-black text-indigo-500 uppercase">{field.type} Field</span>
                                        </div>
                                        <button type="button" onClick={() => removeField(field.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* DYNAMIC CHOICE EDITOR */}
                                    {['radio', 'checkbox'].includes(field.type) && (
                                        <div className="space-y-3 mt-4 pl-4 border-l-2 border-slate-50">
                                            {field.options.map((opt, idx) => (
                                                <div key={idx} className="flex items-center gap-3 group/opt">
                                                    <div className={`w-4 h-4 border-2 border-slate-200 ${field.type === 'radio' ? 'rounded-full' : 'rounded'}`} />
                                                    <input 
                                                        className="flex-1 border-none focus:ring-0 text-sm font-medium text-slate-600 p-0"
                                                        value={opt}
                                                        onChange={(e) => updateOption(field.id, idx, e.target.value)}
                                                    />
                                                    <button type="button" onClick={() => removeOption(field.id, idx)} className="opacity-0 group-hover/opt:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                type="button" 
                                                onClick={() => addOption(field.id)}
                                                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-400 mt-2"
                                            >
                                                + Add Option
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <PrimaryButton disabled={processing || data.schema.length === 0}>
                            Save and Publish Form
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}