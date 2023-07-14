export class CreateCareerDto {
  readonly jobTitle: string;
  readonly jobDesc: string;
  readonly companyName: string;
  readonly timeFrom: string;
  readonly timeTo?: string;
}
