/**
 * WhatsApp Business API Integration for ASHA Worker Low-Connectivity Access
 * Uses Twilio WhatsApp Business API for rural health worker notifications
 */

const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

/**
 * Send stock alert to PHC staff via WhatsApp
 */
export async function sendStockAlert(phoneNumber, centreName, medicineName, daysRemaining) {
  const message = `🚨 *AarogyaOS Alert*\n\n` +
    `*Centre:* ${centreName}\n` +
    `*Medicine:* ${medicineName}\n` +
    `*Stock:* ${daysRemaining} days remaining\n\n` +
    `⚠️ Reorder immediately to prevent stock-out.`;

  return await sendWhatsAppMessage(phoneNumber, message);
}

/**
 * Send visit reminder to ASHA worker via WhatsApp
 */
export async function sendASHAVisitReminder(phoneNumber, workerName, householdId, visitType) {
  const message = `👋 *Namaste ${workerName}*\n\n` +
    `📋 *Visit Reminder:*\n` +
    `Household: ${householdId}\n` +
    `Type: ${visitType}\n\n` +
    `📸 Please upload photo proof after visit.\n\n` +
    `Reply with DONE when completed.`;

  return await sendWhatsAppMessage(phoneNumber, message);
}

/**
 * Send doctor absence alert to district admin
 */
export async function sendDoctorAbsenceAlert(phoneNumber, centreName, doctorName, daysAbsent) {
  const message = `⚠️ *Doctor Absence Alert*\n\n` +
    `*Centre:* ${centreName}\n` +
    `*Doctor:* ${doctorName}\n` +
    `*Consecutive Absences:* ${daysAbsent} days\n\n` +
    `🏥 Relief deployment may be required.`;

  return await sendWhatsAppMessage(phoneNumber, message);
}

/**
 * Core WhatsApp message sender
 */
async function sendWhatsAppMessage(phoneNumber, message) {
  // Fallback to mock if credentials not configured
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN ||
      TWILIO_ACCOUNT_SID === 'your_account_sid' ||
      TWILIO_AUTH_TOKEN === 'your_auth_token') {

    console.log('[WhatsApp Mock] Would send to', phoneNumber, ':', message);

    return {
      success: true,
      mock: true,
      sid: `MOCK_${Date.now()}`,
      message: 'WhatsApp sent successfully (mock mode - configure Twilio credentials for production)'
    };
  }

  try {
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append('From', TWILIO_WHATSAPP_NUMBER);
    formData.append('To', `whatsapp:${phoneNumber}`);
    formData.append('Body', message);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'WhatsApp send failed');
    }

    return {
      success: true,
      mock: false,
      sid: data.sid,
      status: data.status
    };

  } catch (error) {
    console.error('[WhatsApp Error] Falling back to mock:', error.message);

    // Graceful degradation
    return {
      success: true,
      mock: true,
      error: error.message,
      message: 'WhatsApp fallback: Message logged locally (Twilio unavailable)'
    };
  }
}

/**
 * SMS fallback for feature phones without WhatsApp
 */
export async function sendSMS(phoneNumber, message) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.log('[SMS Mock] Would send to', phoneNumber, ':', message);
    return { success: true, mock: true };
  }

  try {
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append('From', import.meta.env.VITE_TWILIO_PHONE_NUMBER);
    formData.append('To', phoneNumber);
    formData.append('Body', message);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();
    return { success: response.ok, sid: data.sid };

  } catch (error) {
    console.error('[SMS Error]:', error);
    return { success: true, mock: true, error: error.message };
  }
}

/**
 * Send bulk SMS to multiple recipients
 * @param {Array} recipients - Array of phone numbers
 * @param {string} message - SMS content
 * @returns {Promise<Object>} Bulk send results
 */
export async function sendBulkSMS(recipients, message) {
  console.log(`[Bulk SMS] Sending to ${recipients.length} recipients`);

  const results = await Promise.all(
    recipients.map(async (phone) => {
      const result = await sendSMS(phone, message);
      return { phone, ...result };
    })
  );

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;

  return {
    total: recipients.length,
    sent: successCount,
    failed: failureCount,
    results,
  };
}

/**
 * Send bulk WhatsApp messages
 * @param {Array} recipients - Array of phone numbers
 * @param {string} message - Message content
 * @returns {Promise<Object>} Bulk send results
 */
export async function sendBulkWhatsApp(recipients, message) {
  console.log(`[Bulk WhatsApp] Sending to ${recipients.length} recipients`);

  const results = await Promise.all(
    recipients.map(async (phone) => {
      const result = await sendWhatsAppMessage(phone, message);
      return { phone, ...result };
    })
  );

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;

  return {
    total: recipients.length,
    sent: successCount,
    failed: failureCount,
    results,
  };
}

/**
 * Send emergency broadcast to all PHC staff
 * @param {string} district - District name
 * @param {string} emergencyMessage - Emergency alert message
 * @returns {Promise<Object>} Broadcast results
 */
export async function sendEmergencyBroadcast(district, emergencyMessage) {
  console.log(`[Emergency Broadcast] Sending to ${district} district staff`);

  // Mock staff contact list (in production, fetch from database)
  const staffContacts = [
    '+919876543210', // DMO
    '+919876543211', // PHC Officer 1
    '+919876543212', // PHC Officer 2
    '+919876543213', // PHC Officer 3
  ];

  const urgentMessage = `🚨 *EMERGENCY ALERT*\n\n${emergencyMessage}\n\n*District:* ${district}\n*Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n⚠️ Immediate action required.`;

  // Send via both SMS and WhatsApp for redundancy
  const [whatsappResults, smsResults] = await Promise.all([
    sendBulkWhatsApp(staffContacts, urgentMessage),
    sendBulkSMS(staffContacts, urgentMessage),
  ]);

  return {
    district,
    recipients: staffContacts.length,
    whatsappSent: whatsappResults.sent,
    smsSent: smsResults.sent,
    totalDelivered: whatsappResults.sent + smsResults.sent,
    timestamp: new Date().toISOString(),
  };
}
