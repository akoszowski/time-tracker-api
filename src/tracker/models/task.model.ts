import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Timer } from './timer.model';

export enum Status {
  ACTIVE = 'ACTIVE',
  STOPPED = 'STOPPED',
}

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the task',
});

@ObjectType()
export class Task {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string | null;

  @Field()
  status: Status;

  @Field((returns) => Timer, { nullable: true })
  timer?: Timer;
}
