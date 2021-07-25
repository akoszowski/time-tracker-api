import { Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { TrackerResolver } from './tracker.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TrackerService, TrackerResolver],
})
export class TrackerModule {}
