'use client'


const PeckingOrder = () => {

    const theLadies = [
        {
            id: 1,
            name: "Carrie",
            rank: 1,
            bgColor: "bg-amber-600"
        },
        {
            id: 2,
            name: "Charlotte",
            rank: 2,
            bgColor: "bg-amber-600"
        },
        {
            id: 3,
            name: "Samantha",
            rank: 3,
            bgColor: "bg-amber-600"
        },
        {
            id: 4,
            name: "Miranda",
            rank: 5,
            bgColor: "bg-amber-600"
        },
        {
            id: 5,
            name: "Claire Anne",
            rank: 6,
            bgColor: "bg-purple-900"
        },
        {
            id: 6,
            name: "Annabelle Bronstein",
            rank: 7,
            bgColor: "bg-purple-900"
        },
        {
            id: 7,
            name: "Bunny MacDougal",
            rank: 8,
            bgColor: "bg-purple-900"
        },
        {
            id: 8,
            name: "Magda",
            rank: 4,
            bgColor: "bg-purple-900"
        },

    ]

    const renderPeckingOrder = () => {
        let ladiesSorted = theLadies.sort((a, b) => a.rank - b.rank);
        const crown = "👑"

        return ladiesSorted.map((chicken, index) => (
            <div
                key={chicken.id || index}
                className={`flex flex-row p-2 justify-around w-1/2 m-1 rounded-xl ${chicken.bgColor}`}
            >
                <div className={chicken.bgColor}>
                    {chicken.rank === 1 ? <span className="mr-3">{crown}</span> : null}
                    {chicken.name}:
                    Rank: {chicken.rank}
                </div>
            </div>
        ));
    }


    return (
        <div className="relative flex flex-col justify-center items-center bg-blue-950 rounded-xl p-5 m-3 ml-0 mr-0">
            <h1>Pecking Order</h1>
            {renderPeckingOrder()}
        </div>
    )
}

export default PeckingOrder