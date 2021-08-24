import { TemplateId } from "./template-id";
import { templates } from "./templates";
import { render } from "micromustache";
import { IsEmail, IsEnum, Length, Min } from "class-validator";

export class Mail {
  @IsEmail()
  to: string;

  @IsEmail()
  from: string;

  @Length(3)
  subject: string;

  @Length(10)
  body: string;

  constructor(to: string, from: string, subject: string, body: string) {
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.body = body;
  }
}
