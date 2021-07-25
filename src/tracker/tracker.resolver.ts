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

@Resolver((of) => Task)
export class TrackerResolver {
  constructor(private readonly trackerService: TrackerService) {}

  @Query((returns) => Task, {
    description: 'Enables user to fetch currently running task.',
  })
  async fetchCurrentTask() {
    return await this.trackerService.getCurrentTask();
  }

  @Query((returns) => [Task], {
    description: 'Enables user to see already finished tasks.',
  })
  async getFinishedTasks() {
    return await this.trackerService.getFinishedTasks();
  }

  @ResolveField('timer')
  async timer(@Parent() task: Task) {
    return await this.trackerService.timer(task.id);
  }

  @Mutation((returns) => Task, {
    description: 'Stop currently running task, it finish time is saved.',
  })
  async stopCurrentTask() {
    const curTime = new Date();

    return await this.trackerService.stopCurrentTask(curTime);
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
