import { ReminderSettings } from '../types';
import * as api from './api';

class ReminderService {
  async getSettings(): Promise<ReminderSettings> {
    return await api.getReminderSettings();
  }

  async updateSettings(settings: Partial<ReminderSettings>): Promise<void> {
    return await api.updateReminderSettings(settings);
  }
}

const reminderService = new ReminderService();
export default reminderService;