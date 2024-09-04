import { Request, Response } from 'express';
import {asyncHandler} from '../utils/asyncHandler';
import {ApiResponse} from '../utils/ApiResponse';
import { Ball } from '../models';
import { Match } from '../models';


const updateMatchScore = asyncHandler(async (req:Request, res:Response) => {
  const { matchId, ballNumber, batsman, bowler, runs, ballType, extras, isWicket } = req.body;

  const match = await Match.findById(matchId);
  if (!match) {
    throw new Error('Match not found');
  }
  const extrasData = extras || { wide: 0, noBall: 0, bye: 0, legBye: 0 };

  const newBall = new Ball({
    ballNumber,
    batsman,
    bowler,
    runs,
    ballType,
    extras: extrasData,
    isWicket: isWicket || false,
  });

  match.totalRuns += runs + extrasData.wide + extrasData.noBall + extrasData.bye + extrasData.legBye;

  if (isWicket) {
    match.totalWickets += 1; 
  }

  await newBall.save();
  match.balls.push(newBall._id);
  await match.save();
  res.status(200).json(new ApiResponse(200,"ball Update SuccessFully"))
});


const createMatch = asyncHandler(async (req:Request, res:Response) => {
  const { matchName, battingTeam, bowlerTeam } = req.body;

  const newMatch = new Match({
    matchName,
    battingTeam,
    bowlerTeam,
  });

  await newMatch.save();
  res.status(200).json(new ApiResponse(200, newMatch, "Match Created SuccessFully!!!"))
});

const getAllMatchesWithDetails = asyncHandler(async(req:Request, res:Response) => {
  const matches = await Match.aggregate([
    {
      $lookup: {
        from: 'balls',
        localField: 'balls',
        foreignField: '_id',
        as: 'ballDetails',
      },
    },
    {
      $unwind: {
        path: '$ballDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { 'ballDetails.ballNumber': 1 },
    },
    {
      $group: {
        _id: '$_id',
        matchName: { $first: '$matchName' },
        battingTeam: { $first: '$battingTeam' },
        bowlerTeam: { $first: '$bowlerTeam' },
        totalRuns: { $first: '$totalRuns' },
        totalWickets: { $first: '$totalWickets' },
        balls: { $first: '$balls' },
        ballDetails: { $push: '$ballDetails' },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  res.status(200).json(new ApiResponse(200, matches, "Match fetched SuccessFully!!!"))
  
})

export{
  updateMatchScore,
  createMatch,
  getAllMatchesWithDetails
}
