import { Score } from '../score/score';

export class HighScore {
  id: number | null;
  scoreTitle: string | null;
  firstPlace: Score | null;
  secondPlace: Score | null;
  thirdPlace: Score | null;
}
