import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HorseService } from './horse.service';
import { Horse } from '../../domain/models/horse.model';
import { Mare } from '../../domain/models/mare.model';
import { CreateHorseRequest } from '../../domain/Dtos/create-horse.request';
import { MareStatus } from '../../domain/enums/mareStatus.enum';
import { Sex } from '../../domain/enums/sex.enum';

describe('HorseService', () => {
  let service: HorseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HorseService],
    });

    service = TestBed.inject(HorseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('should fetch all horses (including mares)', () => {
    const mare: Mare = {
      id: '1',
      name: 'Bella',
      birthYear: 2018,
      height: 1.65,
      sex: Sex.Female,
      healthCertificate: 'CERT-001',
      status: [MareStatus.Open],
    };

    service.getAllHorses().subscribe((horses) => {
      expect(horses.length).toBe(1);

      const horse: Horse = horses[0];
      expect(horse.name).toBe('Bella');
      expect(horse.sex).toBe(Sex.Female);

      const mareHorse = horse as Mare;
      expect(mareHorse.status).toContain(MareStatus.Open);
    });

    const req = httpMock.expectOne('/api/Horse');
    expect(req.request.method).toBe('GET');

    req.flush([mare]);
  });
  it('should create a horse', () => {
    const request: CreateHorseRequest = {
      name: 'Spirit',
      birthYear: 2020,
      height: 1.6,
      sex: Sex.Male,
      healthCertificate: 'CERT-002',
    };

    const response: Horse = {
      id: '2',
      ...request,
    };

    service.createHorse(request).subscribe((horse) => {
      expect(horse.id).toBe('2');
      expect(horse.name).toBe('Spirit');
      expect(horse.sex).toBe(Sex.Male);
    });

    const req = httpMock.expectOne('/api/Horse');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(response);
  });
});
