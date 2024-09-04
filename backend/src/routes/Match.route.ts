import {getAllMatchesWithDetails, createMatch, updateMatchScore} from "../controllers/Match.controller";
import { Router } from "express";
import { Match } from "../models";

const MatchRouter = Router()

MatchRouter.route('/all-matches-details').post(getAllMatchesWithDetails)

MatchRouter.route('/create-match').post(createMatch);

MatchRouter.route('/update-match').post(updateMatchScore)

export default MatchRouter;
