import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddTaskInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
