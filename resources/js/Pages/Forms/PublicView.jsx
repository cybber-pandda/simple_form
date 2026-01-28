import { Head, useForm } from '@inertiajs/react';

export default function PublicView({ form }) {
    // Initialize state correctly for different types
    const initialState = {};
    form.schema.forEach(field => {
        // Checkboxes need an array to store multiple values
        initialState[field.id] = field.type === 'checkbox' ? [] : '';
    });

    const { data, setData, post, processing } = useForm(initialState);

    const submit = (e) => {
        e.preventDefault();
        post(route('forms.submit', form.slug));
    };

    // Helper for Checkbox logic
    const handleCheckboxChange = (fieldId, option, isChecked) => {
        const currentValues = data[fieldId] || [];
        if (isChecked) {
            setData(fieldId.toString(), [...currentValues, option]);
        } else {
            setData(fieldId.toString(), currentValues.filter(v => v !== option));
        }
    };

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

                                {/* RENDERER: Switches UI based on field type */}
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={data[field.id]}
                                        onChange={e => setData(field.id.toString(), e.target.value)}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium min-h-[120px]"
                                        required={field.required}
                                    />
                                ) : ['radio', 'checkbox'].includes(field.type) ? (
                                    <div className="grid gap-3">
                                        {field.options.map((option, idx) => (
                                            <label 
                                                key={idx} 
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                                    (field.type === 'radio' ? data[field.id] === option : data[field.id].includes(option))
                                                    ? 'border-indigo-600 bg-indigo-50/30'
                                                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                                                }`}
                                            >
                                                <input
                                                    type={field.type}
                                                    name={field.id.toString()}
                                                    checked={field.type === 'radio' ? data[field.id] === option : data[field.id].includes(option)}
                                                    onChange={e => {
                                                        if (field.type === 'radio') {
                                                            setData(field.id.toString(), option);
                                                        } else {
                                                            handleCheckboxChange(field.id, option, e.target.checked);
                                                        }
                                                    }}
                                                    className={`w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 ${field.type === 'radio' ? 'rounded-full' : 'rounded-md'}`}
                                                    required={field.required && field.type === 'radio' && !data[field.id]}
                                                />
                                                <span className="font-bold text-slate-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type={field.type} // text, email, number
                                        value={data[field.id]}
                                        onChange={e => setData(field.id.toString(), e.target.value)}
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
                            {processing ? 'Saving...' : 'Submit Response'}
                        </button>
                    </form>
                </div>
                
                <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                    Powered by YourBrand AI Forms
                </p>
            </div>
        </div>
    );
}