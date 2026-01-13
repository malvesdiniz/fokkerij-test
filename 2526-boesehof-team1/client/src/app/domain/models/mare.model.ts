import { MareStatus } from '../enums/mareStatus.enum';
import { Horse } from './horse.model';

export interface Mare extends Horse {
  status: MareStatus[];
}
