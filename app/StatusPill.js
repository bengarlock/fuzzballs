export default function StatusPill({ active }) {
    return (
        <div
            className={`px-4 py-1 rounded-full text-sm font-medium tracking-wide
        ${
                active
                    ? "bg-green-500/20 text-green-300"
                    : "bg-indigo-500/20 text-indigo-300"
            }`}
        >
            {active ? "☀️ Active" : "🌙 Roosting"}
        </div>
    );
}