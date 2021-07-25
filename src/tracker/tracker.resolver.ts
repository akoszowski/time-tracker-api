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

  @Query((returns) => Task)
  async fetchCurrentTask() {
    return await this.trackerService.getCurrentTask();
  }

  @Query((returns) => [Task])
  async getFinishedTasks() {
    return await this.trackerService.getFinishedTasks();
  }

  @ResolveField('timer')
  async timer(@Parent() task: Task) {
    return await this.trackerService.timer(task.id);
  }

  @Mutation((returns) => Task)
  async stopCurrentTask() {
    const curTime = new Date();

    return await this.trackerService.stopCurrentTask(curTime);
  }

  @Mutation((returns) => Task)
  async addNewTask(@Args('data') data: AddTaskInput) {
    const curTime = new Date();

    await this.trackerService.stopCurrentTask(curTime);

    return await this.trackerService.addNewTask(data, curTime);
  }
}
