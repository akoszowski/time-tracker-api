import { Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { TrackerResolver } from './tracker.resolver';

@Module({
  providers: [TrackerService, TrackerResolver]
})
export class TrackerModule {}
