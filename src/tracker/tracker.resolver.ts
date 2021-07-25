import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Task } from './models/task.model';
import { TrackerService } from './tracker.service';
import { AddTaskInput } from './dto/addTask.input';
import { BadRequestException } from '@nestjs/common';

@Resolver((of) => Task)
export class TrackerResolver {
  constructor(private readonly trackerService: TrackerService) {}

  @Query((returns) => Task, {
    description:
      'Enables user to fetch currently running task. Throws BadRequestException if such does not exist.',
  })
  async fetchCurrentTask() {
    const curTask = await this.trackerService.getCurrentTask();

    if (curTask) {
      return curTask;
    }

    throw new BadRequestException('No currently running task!');
  }

  @Query((returns) => [Task], {
    description:
      'Enables user to see already finished tasks. Throws BadExceptionError if those do not exist.',
  })
  async getFinishedTasks() {
    const finishedTasks = await this.trackerService.getFinishedTasks();

    if (finishedTasks) {
      return finishedTasks;
    }

    throw new BadRequestException('No finished tasks yet!');
  }

  @ResolveField('timer')
  async timer(@Parent() task: Task) {
    return await this.trackerService.timer(task.id);
  }

  @Mutation((returns) => Task, {
    description:
      'Stop currently running task, its finish time is saved. Throws BadRequestException if such does not exist. ',
  })
  async stopCurrentTask() {
    const curTime = new Date();

    const stoppedTask = await this.trackerService.stopCurrentTask(curTime);

    if (stoppedTask) {
      return stoppedTask;
    }

    throw new BadRequestException('No currently running task!');
  }

  @Mutation((returns) => Task, {
    description:
      'Stops currently running task. Saves it finish time and starts tracking currently added task.',
  })
  async addNewTask(@Args('data') data: AddTaskInput) {
    const curTime = new Date();

    await this.trackerService.stopCurrentTask(curTime);

    return await this.trackerService.addNewTask(data, curTime);
  }
}
