import { useLocation } from "react-router-dom"

export default function UserPannel(){
    const location = useLocation();
    const fetchMatchDetail = location.state?.e;
    console.log(fetchMatchDetail);
    
    return(
        <div className="flex items-center justify-center p-10 h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="w-3/4 max-w-2xl p-8 rounded-lg shadow-lg bg-white">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {fetchMatchDetail.battingTeam} vs {fetchMatchDetail.bowlerTeam}
            </h1>
            <h2 className="text-xl text-gray-600 mt-2">
              Score: {fetchMatchDetail.totalRuns}/{fetchMatchDetail.totalWickets}
            </h2>
          </div>
      
          <div className="flex overflow-x-auto whitespace-nowrap py-4 space-x-4">
            {fetchMatchDetail.ballDetails.map((e, index) => (
              <div
                key={index}
                className=" flex-shrink-0 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-md w-32"
              >
                <h1 className="text-lg font-semibold text-blue-700 mb-2">
                  Ball: {e.ballNumber + 1}
                </h1>
                <p className="text-center">
                  {e.isWicket ? (
                    <span className="text-red-500 font-bold">Wicket</span>
                  ) : (
                    <>
                      {e.runs > 0 && (
                        <span className="text-green-600 font-medium">Runs: {e.runs}</span>
                      )}
                      {e.extras &&
                        (e.extras.wide > 0 ||
                          e.extras.noBall > 0 ||
                          e.extras.bye > 0 ||
                          e.extras.legBye > 0) && (
                          <span className="block text-xs text-gray-500 mt-1">
                            Extras:
                            {e.extras.wide > 0 && (
                              <span className="ml-1 bg-yellow-200 px-1 rounded">WD {e.extras.wide}</span>
                            )}
                            {e.extras.noBall > 0 && (
                              <span className="ml-1 bg-red-200 px-1 rounded">NB {e.extras.noBall}</span>
                            )}
                            {e.extras.bye > 0 && (
                              <span className="ml-1 bg-blue-200 px-1 rounded">B {e.extras.bye}</span>
                            )}
                            {e.extras.legBye > 0 && (
                              <span className="ml-1 bg-purple-200 px-1 rounded">LB {e.extras.legBye}</span>
                            )}
                          </span>
                        )}
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}