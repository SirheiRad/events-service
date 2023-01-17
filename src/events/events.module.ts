import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './schemas/event.schema';
import { EventsService } from './events.service';
import { EventsGateway } from './eventsWS.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    ClientsModule.register([
      { name: 'EVENTS_SERVICE', transport: Transport.TCP },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsGateway],
})
export class EventsModule {}
