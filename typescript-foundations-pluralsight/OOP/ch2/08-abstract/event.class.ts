export abstract class Event {
  abstract cancel(): boolean;

  constructor(protected title: string) {}

  protected toDisplayName(): string {
    return this.title;
  }
}
