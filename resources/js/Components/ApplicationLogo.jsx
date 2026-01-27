export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* The Icon Box */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                >
                    <path
                        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* The Brand Name Label */}
            <span className="text-2xl font-black tracking-tighter text-slate-800">
                Form<span className="text-indigo-600">Flow</span>
            </span>
        </div>
    );
}