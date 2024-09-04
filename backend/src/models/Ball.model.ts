import { Schema, model, Document } from 'mongoose';

export interface IBall extends Document {
  ballNumber: number;
  batsman: string;
  bowler: string;
  runs: number;
  ballType: string; 
  extras: {
    wide: number;
    noBall: number;
    bye: number;
    legBye: number;
  };
  isWicket: boolean;
}

const BallSchema: Schema = new Schema({
  ballNumber: { type: Number, required: true },
  batsman: { type: String, required: true },
  bowler: { type: String, required: true },
  runs: { type: Number, default: 0 },
  ballType: { type: String, required: true },
  extras: {
    wide: { type: Number, default: 0 },
    noBall: { type: Number, default: 0 },
    bye: { type: Number, default: 0 },
    legBye: { type: Number, default: 0 },
  },
  isWicket: { type: Boolean, default: false },
});

export const Ball = model<IBall>('Ball', BallSchema);
