"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Match_controller_1 = __importDefault(require("../controllers/Match.controller"));
const express_1 = require("express");
const MatchRouter = (0, express_1.Router)();
MatchRouter.route('/all-matches-details').post(Match_controller_1.default);
exports.default = MatchRouter;
