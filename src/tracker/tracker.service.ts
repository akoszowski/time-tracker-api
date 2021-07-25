import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddTaskInput } from './dto/addTask.input';

@Injectable()
export class TrackerService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentTask() {
    return await this.prisma.task.findFirst({
      where: {
        status: 'ACTIVE',
      },
    });
  }

  async getFinishedTasks() {
    return await this.prisma.task.findMany({
      where: {
        status: 'STOPPED',
      },
    });
  }

  async timer(id) {
    return await this.prisma.timer.findFirst({
      where: {
        taskId:id,
      },
    });
  }

  async stopCurrentTask(curTime: Date) {
    const curTask = await this.getCurrentTask();

    if (curTask) {
      return await this.prisma.task.update({
        where: {
          id: curTask.id,
        },
        data: {
          status: 'STOPPED',
          timer: {
            update: {
              finishTime: curTime,
            },
          },
        },
      });
    }

    return null;
  }

  async addNewTask(data: AddTaskInput, curTime: Date) {
    return await this.prisma.task.create({
      data: {
        ...data,
        status: 'ACTIVE',
        timer: {
          create: {
            startTime: curTime,
            finishTime: null,
          },
        },
      },
    });
  }
}
