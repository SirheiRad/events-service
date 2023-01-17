import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './eventsWS.gateway';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';

@Controller('/event')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGatewayWS: EventsGateway,
  ) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    const event = await this.eventsService.create(createEventDto);
    await this.eventsGatewayWS.emitEvent({ event, status: 'Created' });
    return event;
  }

  @Get('/events/:type')
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
    await this.eventsGatewayWS.emitEvent({event, status: 'Deleted'});
    return event;
  }
}
