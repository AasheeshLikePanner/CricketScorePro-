import { Schema, model, Document, Types } from 'mongoose';
import { IBall } from './Ball.model';

interface IMatch extends Document {
  matchName: string;
  battingTeam: string;
  bowlerTeam: string;
  totalRuns: number;
  totalWickets: number;
  balls: Types.Array<IBall>; 
}

const MatchSchema: Schema = new Schema({
  matchName: { type: String, required: true },
  battingTeam: { type: String, required: true },
  bowlerTeam: { type: String, required: true },
  totalRuns: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  balls: [{ type: Schema.Types.ObjectId, ref: 'Ball' }], 
});

export const Match = model<IMatch>('Match', MatchSchema);
