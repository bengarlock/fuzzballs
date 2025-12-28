import Age from "@/app/age";

export default function ChickenCard({title, chickens, bg, birthDate}) {
    return (
        <div className={`${bg} rounded-xl p-4`}>
            <h2 className="text-2xl font-semibold mb-3">{title}</h2>

            <ul className="space-y-1 text-white/90">
                {chickens.map((c) => (
                    <li key={c.name}>
                        {c.name} – <span className={c.ringColor}>{c.color}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-3 text-sm text-white/70">
                <Age date={birthDate}/>
            </div>
        </div>

    );
}