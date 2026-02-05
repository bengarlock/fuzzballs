import Age from "@/app/age";

export default function ChickenCard({title, chickens, bg, birthDate}) {
    return (
        <div
            className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-xl bg-white/10 ${bg}`}
        >
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white/95 mb-3">
                {title}
            </h2>

            <ul className="space-y-1 text-sm md:text-base text-white/90">
                {chickens.map((c) => (
                    <li key={c.name} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60"/>
                        <span>
                            {c.name} – <span className={c.ringColor}>{c.color}</span>
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-4 text-xs md:text-sm text-white/70">
                <Age date={birthDate}/>
            </div>
        </div>
    );
}