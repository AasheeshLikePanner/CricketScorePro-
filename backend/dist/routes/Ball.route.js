"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ball_controller_1 = require("../controllers/Ball.controller");
const express_1 = require("express");
const BallRouter = (0, express_1.Router)();
BallRouter.route('/create-ball').post(Ball_controller_1.createBall);
BallRouter.route('/update-ball-score').post(Ball_controller_1.UpdateBallScoring);
exports.default = BallRouter;
