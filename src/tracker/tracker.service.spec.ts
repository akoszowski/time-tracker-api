import { Test, TestingModule } from '@nestjs/testing';
import { TrackerService } from './tracker.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../test/singleton';
import { CacheModule } from '@nestjs/common';
import { AddTaskInput } from './dto/addTask.input';
import { Status, Task } from './models/task.model';

describe('TrackerService', () => {
  let service: TrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 0, // disable expiration of cache
        }),
      ],
      providers: [TrackerService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    service = module.get<TrackerService>(TrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return currently running task - undefined case', async () => {
    expect(await service.getCurrentTask()).toEqual(undefined);
  });

  it('should return finished tasks', async () => {
    const finishedTasks: Task[] = [
      {
        id: 5,
        name: 'First finished task',
        description: 'Some description',
        status: Status.STOPPED,
        timer: {
          id: Math.random(),
          startTime: new Date(2021, 6, 23),
          finishTime: new Date(2021, 6, 24),
          taskId: 5,
        },
      },
      {
        id: 6,
        name: 'Second finished task',
        description: 'Some description',
        status: Status.STOPPED,
        timer: {
          id: Math.random(),
          startTime: new Date(2021, 6, 24),
          finishTime: new Date(),
          taskId: 6,
        },
      },
    ];

    prismaMock.task.findMany.mockResolvedValue(finishedTasks);

    expect(await service.getFinishedTasks()).toEqual(finishedTasks);

    expect(prismaMock.task.findMany).toHaveBeenCalled();
  });

  it('should return timer for parent task', async () => {
    const timerInfo = {
      id: Math.random(),
      startTime: new Date(),
      finishTime: null,
    };

    const taskId = Math.random();

    prismaMock.timer.findFirst.mockResolvedValue({
      ...timerInfo,
      taskId: taskId,
    });

    expect(await service.timer(taskId)).toEqual({
      ...timerInfo,
      taskId: taskId,
    });

    expect(prismaMock.timer.findFirst).toHaveBeenCalled();
  });

  it('should stop currently running task - null case', async () => {
    const curTime = new Date();

    expect(await service.stopCurrentTask(curTime)).toEqual(null);

    expect(prismaMock.task.update).toBeCalledTimes(0);
  });

  it('should add new task and cache it, finally stop it and check if removed from cache', async () => {
    const data: AddTaskInput = {
      name: 'New Task',
      description: 'Some description',
    };
    const lastTime = new Date(2021, 6, 24);
    const curTime = new Date();

    const curTask: Task = {
      id: 1,
      ...data,
      status: Status.ACTIVE,
      timer: {
        id: Math.random(),
        startTime: lastTime,
        finishTime: null,
        taskId: 1,
      },
    };

    prismaMock.task.create.mockResolvedValue(curTask);

    expect(await service.addNewTask(data, curTime)).toEqual(curTask);

    expect(prismaMock.task.create).toHaveBeenCalled();

    expect(await service.getCurrentTask()).toEqual(curTask);

    const stoppedTask = Object.assign({}, curTask);
    stoppedTask.status = Status.STOPPED;
    stoppedTask.timer = Object.assign({}, curTask.timer);
    stoppedTask.timer.finishTime = curTime;

    prismaMock.task.update.mockResolvedValue(stoppedTask);

    expect(await service.stopCurrentTask(curTime)).toEqual(stoppedTask);

    expect(prismaMock.task.update).toHaveBeenCalled();

    expect(await service.getCurrentTask()).toEqual(undefined);
  });
});
