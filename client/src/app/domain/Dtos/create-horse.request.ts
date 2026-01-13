import { Sex } from '../enums/sex.enum';

export interface CreateHorseRequest {
  name: string;
  birthYear: number;
  height: number;
  sex: Sex;
  healthCertificate: string;
}
