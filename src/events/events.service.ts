import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async create(createEvent: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEvent);
    return createdEvent.save();
  }

  async findAllByType(type: string): Promise<Event[]> {
    return this.eventModel.find({ type }).exec();
  }

  async findOne(id: string): Promise<Event> {
    return this.eventModel.findOne({ _id: id }).exec();
  }

  async delete(id: string): Promise<Event> {
    const deletedEvent = await this.eventModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedEvent;
  }
}
