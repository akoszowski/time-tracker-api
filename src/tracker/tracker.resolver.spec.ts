import { Test, TestingModule } from '@nestjs/testing';
import { TrackerResolver } from './tracker.resolver';

describe('TrackerResolver', () => {
  let resolver: TrackerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackerResolver],
    }).compile();

    resolver = module.get<TrackerResolver>(TrackerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
