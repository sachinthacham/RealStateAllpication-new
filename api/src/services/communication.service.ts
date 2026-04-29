import { AppError } from '../utils/appError';

type Channel = 'email' | 'whatsapp';

interface DispatchPayload {
  channel: Channel;
  recipient: string;
  subject?: string;
  message: string;
  context?: Record<string, unknown>;
}

export class CommunicationService {
  /**
   * Placeholder dispatcher for provider-ready communication contracts.
   * Returns queue-style metadata so real providers can be integrated later.
   */
  async dispatch(payload: DispatchPayload) {
    if (!payload.recipient || !payload.message) {
      throw new AppError('recipient and message are required', 400);
    }

    const providerStatus = 'queued';
    const queueId = `comm_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    return {
      queueId,
      providerStatus,
      channel: payload.channel,
      recipient: payload.recipient,
      subject: payload.subject ?? '',
      messagePreview: payload.message.slice(0, 120),
      context: payload.context ?? {},
      dispatchedAt: new Date(),
    };
  }

  generateWhatsappLink(phone: string, text: string) {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
}
