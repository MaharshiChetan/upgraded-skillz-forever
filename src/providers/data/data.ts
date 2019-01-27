import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  constructor() {}

  filterMessages(messages, searchTerm) {
    return messages.filter(message => {
      return message.userName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  filterEvents(events, searchTerm) {
    return events.filter(event => {
      return event.eventName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
