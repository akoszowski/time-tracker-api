import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class AddTaskInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(400)
  description: string | null;
}
