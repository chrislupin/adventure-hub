import { createSubmissionHandler } from '@/lib/submissions';
import { getMongoSubmissionStore } from '@/lib/server/mongodb';
import { siteConfig } from '@/lib/site-config';

export const runtime = 'nodejs';

const handleInquiry = createSubmissionHandler('inquiry', {
  getStore: getMongoSubmissionStore,
  getWhatsAppNumber: () => siteConfig.contact.whatsappNumber,
});

export const POST = handleInquiry;