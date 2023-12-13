db.lifeexpectancy.aggregate([
    {
        $group: {
            _id: "$year", // Group by the year field
            count: { $sum: 1 } // Count the documents in each group
        }
    },
    {
        $sort: { _id: -1 } // Optional: Sort by year if needed
    }
])

db.countries.aggregate([
    { $sort: { entity: 1, ymd: 1 } }, // Sort by entity and ymd
    { $group: {
        _id: "$entity",
        first_life_expectancy: { $first: "$life_expectancy" },
        last_life_expectancy: { $last: "$life_expectancy" }
    }},
    { $project: {
        _id: 0,
        entity: "$_id",
        first_life_expectancy: { $round: ["$first_life_expectancy", 2] },
        last_life_expectancy: { $round: ["$last_life_expectancy", 2] },
        percent_change: { 
            $round: [
                { $multiply: [
                    { $divide: [
                        { $subtract: ["$last_life_expectancy", "$first_life_expectancy"] },
                        "$first_life_expectancy"
                    ]},
                    100
                ]},
                2
            ]
        }
    }}
]);
