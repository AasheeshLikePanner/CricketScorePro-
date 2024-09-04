    import React from 'react';

    // Define the component to receive props
    const CricketScorecard = ({ batsmen, bowler, lastWicket, teamRun, extra }) => {
        
        return (
            <div className="p-6 rounded-md border-2 bg-gray-100 w-full">
            <h1 className="text-2xl font-bold mb-6">Cricket Scorecard</h1>

            {/* Batsmen Scorecard */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Batsmen Scorecard</h2>
                <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="border p-2">Batsman Name</th>
                    <th className="border p-2">Runs</th>
                    <th className="border p-2">Balls</th>
                    <th className="border p-2">4s</th>
                    <th className="border p-2">6s</th>
                    <th className="border p-2">Strike Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {batsmen.map((batsman, index) => (
                    <tr key={index}>
                        <td className="border p-2">{batsman.name}</td>
                        <td className="border p-2">{batsman.runs}</td>
                        <td className="border p-2">{batsman.balls}</td>
                        <td className="border p-2">{batsman.fours}</td>
                        <td className="border p-2">{batsman.sixes}</td>
                        <td className="border p-2">{batsman.strikeRate}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Bowlers Scorecard */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Bowlers Scorecard</h2>
                <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="border p-2">Bowler Name</th>
                    <th className="border p-2">Ball</th>
                    <th className="border p-2">Overs</th>
                    <th className="border p-2">Maidens</th>
                    <th className="border p-2">Runs</th>
                    <th className="border p-2">Wickets</th>
                    <th className="border p-2">Economy</th>
                    </tr>
                </thead>
                <tbody>
                    {bowler.map((bow, index) => (
                    <tr key={index}>
                        <td className="border p-2">{bow.name}</td>
                        <td className='border p-2'>{bow.ball}</td>
                        <td className="border p-2">{bow.overs}</td>
                        <td className="border p-2">{bow.maidens}</td>
                        <td className="border p-2">{bow.runs}</td>
                        <td className="border p-2">{bow.wickets}</td>
                        <td className="border p-2">{bow.economy}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Last Wicket Details */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Last Wicket Details</h2>
                <div className="border p-4 bg-white rounded-md">
                <p className="text-sm mb-2">
                    <strong>Last Wicket:</strong> {lastWicket.batsmanName} - {lastWicket.wicketMode} by {lastWicket.fielder} off {lastWicket.bowlerName}
                </p>

                </div>
            </div>
            <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Extras Summary</h2>
        <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-center">Runs</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border p-2">Team Runs</td>
                    <td className="border p-2 text-center">{teamRun}</td>
                </tr>
                <tr>
                    <td className="border p-2">Wide</td>
                    <td className="border p-2 text-center">{extra.wide}</td>
                </tr>
                <tr>
                    <td className="border p-2">No Ball</td>
                    <td className="border p-2 text-center">{extra.noBall}</td>
                </tr>
                <tr>
                    <td className="border p-2">Bye</td>
                    <td className="border p-2 text-center">{extra.bye}</td>
                </tr>
                <tr>
                    <td className="border p-2">Leg Bye</td>
                    <td className="border p-2 text-center">{extra.LegBye || 0}</td>
                </tr>
            </tbody>
        </table>
    </div>
            </div>
        );
    };

    export default CricketScorecard;
