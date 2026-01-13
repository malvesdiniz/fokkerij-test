import { Sex } from '../enums/sex.enum';

export interface Horse {
  id: string;
  name: string;
  birthYear: number;
  height: number;
  sex: Sex;
  healthCertificate: string;
}
