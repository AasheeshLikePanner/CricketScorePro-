"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = require("mongoose");
const MatchSchema = new mongoose_1.Schema({
    "_id": "ObjectId",
    "teams": [
        {
            "name": "String",
            "players": [
                {
                    "name": "String",
                    "role": "String"
                }
            ]
        }
    ],
    "date": "Date",
    "venue": "String",
    "innings": [
        { "type": "ObjectId", "ref": "Innings" }
    ]
});
exports.Match = (0, mongoose_1.model)('Match', MatchSchema);
