import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Inject,
} from '@nestjs/common';
import { EventPattern, ClientProxy } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { EventsGateway } from './eventsWS.gateway';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';

@Controller('/events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGatewayWS: EventsGateway,
    @Inject('EVENTS_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    const event = await this.eventsService.create(createEventDto);
    await this.client.emit<Event>('event_created', event);
    await this.eventsGatewayWS.emitEvent({ event, status: 'Created' });
    return event;
  }

  @Get('/event/:type')
  async findAllByType(@Param('type') type: string): Promise<Event[]> {
    return this.eventsService.findAllByType(type);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<Event> {
    const event = await this.eventsService.delete(id);
    await this.client.emit<Event>('event_deleted', event);
    await this.eventsGatewayWS.emitEvent(event);
    return event;
  }

  @EventPattern('event_created')
  async emitCreateEventWS(event: Event) {
    this.eventsGatewayWS.emitEvent({ event, status: 'Created' });
  }

  @EventPattern('event_deleted')
  async emitDeleteEventWS(event: Event) {
    this.eventsGatewayWS.emitEvent({ event, status: 'Deleted' });
  }
}
