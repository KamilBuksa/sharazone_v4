export class CreatePhotoEvent {
  constructor(
    public readonly email:string,
    public readonly password:string

  ) {
  }
}