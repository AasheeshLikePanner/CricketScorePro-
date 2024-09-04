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
exports.UpdateBallScoring = exports.createBall = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const index_1 = require("../models/index");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const UpdateBallScoring = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ballId } = req.params;
    const { ballType, runsScored, isWicket, wicketType, isOverthrow } = req.body;
    const ball = yield index_1.Ball.findById(ballId).populate('overId').exec();
    if (!ball) {
        throw new ApiError_1.ApiError(404, "Ball not found");
    }
    const over = yield index_1.Over.findById(ball.overId).populate('inningsId').exec();
    if (!over) {
        throw new ApiError_1.ApiError(404, "Over not found");
    }
    const innings = yield index_1.Innings.findById(over.inningsId).exec();
    if (!innings) {
        throw new ApiError_1.ApiError(404, "Innings not found");
    }
    const batsman = yield index_1.Player.findById(ball.batsmanId).exec();
    if (!batsman) {
        throw new ApiError_1.ApiError(404, "Batsman not found");
    }
    const bowler = yield index_1.Player.findById(ball.bowlerId).exec();
    if (!bowler) {
        throw new ApiError_1.ApiError(404, "Bowler not found");
    }
    switch (ballType) {
        case 'wide':
            yield handleWide(ball, runsScored, innings, bowler);
            break;
        case 'no_ball':
            yield handleNoBall(ball, runsScored, innings, bowler);
            break;
        case 'bye':
        case 'leg_bye':
            yield handleByeOrLegBye(ball, runsScored, innings, ballType);
            break;
        case 'normal':
            yield handleNormal(ball, runsScored, innings, isOverthrow);
            break;
        default:
            return res.status(400).json(new ApiResponse_1.ApiResponse(400, null, 'Invalid ball type'));
    }
    if (isWicket) {
        yield handleWicket(ball, batsman, innings, wicketType);
    }
    yield ball.save();
    yield over.save();
    yield innings.save();
    yield batsman.save();
    yield bowler.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { ball, over, innings }, 'Score updated successfully'));
}));
exports.UpdateBallScoring = UpdateBallScoring;
const handleWide = (ball, runsScored, innings, bowler) => __awaiter(void 0, void 0, void 0, function* () {
    ball.extras.wides += 1;
    ball.runsScored = 0;
    innings.totalRuns += runsScored;
    bowler.bowlingStats.runsConceded += runsScored;
});
const handleNoBall = (ball, runsScored, innings, bowler) => __awaiter(void 0, void 0, void 0, function* () {
    ball.extras.noBalls += 1;
    ball.runsScored = runsScored;
    innings.totalRuns += runsScored;
    bowler.bowlingStats.runsConceded += runsScored;
});
const handleByeOrLegBye = (ball, runsScored, innings, ballType) => __awaiter(void 0, void 0, void 0, function* () {
    ball.extras[ballType] += 1;
    innings.totalRuns += runsScored;
    ball.runsScored = 0;
});
const handleNormal = (ball, runsScored, innings, isOverthrow) => __awaiter(void 0, void 0, void 0, function* () {
    if (isOverthrow) {
        ball.extras.overthrowRuns += runsScored;
    }
    ball.runsScored = runsScored;
    innings.totalRuns += runsScored;
});
const handleWicket = (ball, batsman, innings, wicketType) => __awaiter(void 0, void 0, void 0, function* () {
    batsman.battingStats.ballsFaced += 1;
    innings.wickets += 1;
    ball.wicketType = wicketType;
    ball.isWicket = true;
});
const createBall = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBall = new index_1.Ball(req.body); // Create a new Ball document
    const savedBall = yield newBall.save(); // Save to database
    res.status(201).json({
        success: true,
        data: savedBall,
        message: 'Ball created successfully',
    });
}));
exports.createBall = createBall;
