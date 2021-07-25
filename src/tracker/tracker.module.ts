import { CacheModule, Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { TrackerResolver } from './tracker.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      ttl: 0, // disable expiration of cache
    }),
  ],
  providers: [TrackerService, TrackerResolver],
})
export class TrackerModule {}
