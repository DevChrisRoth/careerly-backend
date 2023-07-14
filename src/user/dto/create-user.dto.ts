export class CreateUserDto {
  //Userlogin -> schema.prisma
  readonly email: string;
  readonly password: string;

  //Userconfig -> schema.prisma
  readonly firstname: string;
  readonly lastname: string;
  readonly profileImageUrl: string;
  readonly title?: string;
  readonly bioDescription: string;
}
