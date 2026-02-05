'use client'

const PeckingOrder = () => {

    const theLadies = [
        {
            id: 1,
            name: "Carrie",
            rank: 1,
            accent: "text-amber-200",
            chip: "bg-amber-300/15"
        },
        {
            id: 2,
            name: "Charlotte",
            rank: 2,
            accent: "text-amber-200",
            chip: "bg-amber-300/15"
        },
        {
            id: 3,
            name: "Samantha",
            rank: 3,
            accent: "text-amber-200",
            chip: "bg-amber-300/15"
        },
        {
            id: 4,
            name: "Miranda",
            rank: 5,
            accent: "text-amber-200",
            chip: "bg-amber-300/15"
        },
        {
            id: 5,
            name: "Claire Anne",
            rank: 6,
            accent: "text-purple-200",
            chip: "bg-purple-300/15"
        },
        {
            id: 6,
            name: "Annabelle Bronstein",
            rank: 7,
            accent: "text-purple-200",
            chip: "bg-purple-300/15"
        },
        {
            id: 7,
            name: "Bunny MacDougal",
            rank: 8,
            accent: "text-purple-200",
            chip: "bg-purple-300/15"
        },
        {
            id: 8,
            name: "Magda",
            rank: 4,
            accent: "text-purple-200",
            chip: "bg-purple-300/15"
        },
    ]

    const renderPeckingOrder = () => {
        let ladiesSorted = theLadies.sort((a, b) => a.rank - b.rank);
        const crown = "👑"

        return ladiesSorted.map((chicken, index) => (
            <div
                key={chicken.id || index}
                className="flex items-center justify-between w-full max-w-md px-4 py-2 mt-3 rounded-2xl bg-white/10 border border-white/10"
            >
                <div className="flex items-center gap-3 text-white/95">
                    <span className={`px-2 py-0.5 text-[11px] uppercase tracking-wide rounded-full ${chicken.chip} ${chicken.accent}`}>
                        {chicken.rank === 1 ? `${crown} #${chicken.rank}` : `#${chicken.rank}`}
                    </span>
                    <span className="font-medium">{chicken.name}</span>
                </div>
                <span className={`text-xs ${chicken.accent}`}>Rank {chicken.rank}</span>
            </div>
        ));
    }

    return (
        <div className="w-full">
            <div className="flex flex-col items-center p-6 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white/95">
                    Pecking Order
                </h1>
                {renderPeckingOrder()}

            </div>
        </div>
    )
}

export default PeckingOrder