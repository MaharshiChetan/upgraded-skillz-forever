import { Injectable } from '@angular/core';

@Injectable()
export class DataProvider {
  constructor() {}

  filterItems(messages, searchTerm) {
    return messages.filter(message => {
      return message.userName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
