import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Timer {
  @Field((type) => Int)
  id: number;

  @Field()
  startTime: Date;

  @Field({ nullable: true })
  finishTime?: Date;

  @Field((type) => Int)
  taskId: number;
}
