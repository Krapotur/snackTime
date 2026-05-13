import {
  Injectable,
} from '@angular/core';
import { Network } from '@ngx-builders/pwa-offline';
import { MaterialService } from '../classes/material.service';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  constructor(private network: Network) {}

  // ✅ ПРАВИЛЬНО: явный контекст внедрения
  checkConnection() {
    setTimeout(() => {
      if (this.network.online) {
        MaterialService.toast('Соединение установлено');
      } else {
        MaterialService.toast('Соединение отсутствует');
      }
    }, 1000);
  }
}
