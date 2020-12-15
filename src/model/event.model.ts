export class Event {
  public name: string;
  public start: Date;
  public end: Date;
  public color: string;
  public timed: boolean = true;

  constructor(data: any = {}) {
    this.name = data?.name ?? null;
    this.start = data?.startDate ?? null;
    this.end = data?.endDate ?? null;
    this.color = data?.color ?? ''
  }
}