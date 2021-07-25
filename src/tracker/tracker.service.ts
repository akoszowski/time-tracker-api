import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddTaskInput } from './dto/addTask.input';
import { Cache } from 'cache-manager';
import { Status, Task } from './models/task.model';

@Injectable()
export class TrackerService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCurrentTask() {
    return await this.cacheManager.get('curTask');
  }

  async getFinishedTasks() {
    return await this.prisma.task.findMany({
      where: {
        status: Status.STOPPED,
      },
    });
  }

  async timer(id) {
    return await this.prisma.timer.findFirst({
      where: {
        taskId: id,
      },
    });
  }

  async stopCurrentTask(curTime: Date) {
    const curTask: Task | undefined = await this.cacheManager.get('curTask');

    if (curTask) {
      const updatedTask = await this.prisma.task.update({
        where: {
          id: curTask.id,
        },
        data: {
          status: Status.STOPPED,
          timer: {
            update: {
              finishTime: curTime,
            },
          },
        },
      });

      await this.cacheManager.del('curTask');

      return updatedTask;
    }

    return null;
  }

  async addNewTask(data: AddTaskInput, curTime: Date) {
    const newTask = await this.prisma.task.create({
      data: {
        ...data,
        status: Status.ACTIVE,
        timer: {
          create: {
            startTime: curTime,
            finishTime: null,
          },
        },
      },
    });

    await this.cacheManager.set('curTask', newTask);

    return newTask;
  }
}
