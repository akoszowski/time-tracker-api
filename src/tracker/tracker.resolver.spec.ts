import { Test, TestingModule } from '@nestjs/testing';
import { TrackerResolver } from './tracker.resolver';
import { TrackerService } from './tracker.service';
import { Status, Task } from './models/task.model';
import { Timer } from './models/timer.model';
import { BadRequestException } from '@nestjs/common';

describe('TrackerResolver', () => {
  let resolver: TrackerResolver;

  const curTime = new Date();

  const timerInfo = {
    id: 1,
    startTime: new Date(2021, 6, 24),
  };

  const timer: Timer = {
    ...timerInfo,
    taskId: 1,
  };

  const task: Task = {
    id: 1,
    name: 'Startup House recruitment task',
    description: 'Time tracker back-end API',
    status: Status.ACTIVE,
    timer: timer,
  };

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
        finishTime: curTime,
        taskId: 6,
      },
    },
  ];

  const mockTrackerService = {
    getCurrentTask: jest
      .fn()
      .mockResolvedValue(task)
      .mockResolvedValueOnce(null),

    getFinishedTasks: jest
      .fn()
      .mockResolvedValue(finishedTasks)
      .mockResolvedValueOnce(null),

    timer: jest.fn().mockImplementation((taskId) => {
      return Promise.resolve({
        ...timerInfo,
        taskId: taskId,
      });
    }),

    stopCurrentTask: jest
      .fn()
      .mockResolvedValue(finishedTasks[1])
      .mockResolvedValueOnce(null),

    addNewTask: jest.fn().mockImplementation((data) => {
      return {
        id: 10,
        ...data,
        status: Status.ACTIVE,
        timer: {
          ...timerInfo,
          finishedTime: curTime,
          statusId: 10,
        },
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackerResolver, TrackerService],
    })
      .overrideProvider(TrackerService)
      .useValue(mockTrackerService)
      .compile();

    resolver = module.get<TrackerResolver>(TrackerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return currently running task - null case', async () => {
    await expect(resolver.fetchCurrentTask()).rejects.toThrow(
      BadRequestException,
    );

    expect(mockTrackerService.getCurrentTask).toHaveBeenCalled();
  });

  it('should return currently running task', async () => {
    expect(await resolver.fetchCurrentTask()).toEqual({
      ...task,
    });

    expect(mockTrackerService.getCurrentTask).toHaveBeenCalled();
  });

  it('should return already finished tasks - null case', async () => {
    await expect(resolver.getFinishedTasks()).rejects.toThrow(
      BadRequestException,
    );

    expect(mockTrackerService.getFinishedTasks).toHaveBeenCalled();
  });

  it('should return already finished tasks', async () => {
    expect(await resolver.getFinishedTasks()).toEqual(finishedTasks);

    expect(mockTrackerService.getFinishedTasks).toHaveBeenCalled();
  });

  it('should return timer resolved field', async () => {
    expect(await resolver.timer(task)).toEqual(task.timer);

    expect(mockTrackerService.timer).toHaveBeenCalled();
  });

  it('should return stopped Task - null case', async () => {
    await expect(resolver.stopCurrentTask()).rejects.toThrow(
      BadRequestException,
    );

    expect(mockTrackerService.stopCurrentTask).toHaveBeenCalled();
  });

  it('should return stopped Task', async () => {
    expect(await resolver.stopCurrentTask()).toEqual(finishedTasks[1]);

    expect(mockTrackerService.stopCurrentTask).toHaveBeenCalled();
  });

  it('should return new Task', async () => {
    const data = {
      name: 'New Task',
      description: 'With description',
    };

    expect(await resolver.addNewTask(data)).toEqual({
      id: 10,
      ...data,
      status: Status.ACTIVE,
      timer: {
        ...timerInfo,
        finishedTime: curTime,
        statusId: 10,
      },
    });

    expect(mockTrackerService.addNewTask).toHaveBeenCalled();
  });
});
