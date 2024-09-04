"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("../utils/asyncHandler");
const models_1 = require("../models");
const ApiResponse_1 = require("../utils/ApiResponse");
const getAllMatchesWithDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const matches = yield models_1.Match.aggregate([
        {
            $lookup: {
                from: 'innings', // Collection name for innings
                localField: '_id',
                foreignField: 'matchId',
                as: 'innings'
            }
        },
        {
            $unwind: {
                path: '$innings',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'overs', // Collection name for overs
                localField: 'innings._id',
                foreignField: 'inningsId',
                as: 'innings.overs'
            }
        },
        {
            $unwind: {
                path: '$innings.overs',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'balls', // Collection name for balls
                localField: 'innings.overs._id',
                foreignField: 'overId',
                as: 'innings.overs.balls'
            }
        },
        {
            $group: {
                _id: '$_id',
                teams: { $first: '$teams' },
                date: { $first: '$date' },
                venue: { $first: '$venue' },
                innings: {
                    $push: {
                        _id: '$innings._id',
                        battingTeam: '$innings.battingTeam',
                        bowlingTeam: '$innings.bowlingTeam',
                        totalRuns: '$innings.totalRuns',
                        wickets: '$innings.wickets',
                        overs: {
                            $map: {
                                input: '$innings.overs',
                                as: 'over',
                                in: {
                                    _id: '$$over._id',
                                    overNumber: '$$over.overNumber',
                                    balls: {
                                        $filter: {
                                            input: '$$over.balls',
                                            as: 'ball',
                                            cond: { $eq: ['$$ball.overId', '$$over._id'] }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                teams: 1,
                date: 1,
                venue: 1,
                innings: {
                    _id: 1,
                    battingTeam: 1,
                    bowlingTeam: 1,
                    totalRuns: 1,
                    wickets: 1,
                    overs: {
                        _id: 1,
                        overNumber: 1,
                        balls: 1
                    }
                }
            }
        }
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, matches, 'Matches fetched successfully'));
}));
exports.default = getAllMatchesWithDetails;
