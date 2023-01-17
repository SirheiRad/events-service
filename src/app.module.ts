import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB),
    EventsModule
  ]
})
export class AppModule {}
