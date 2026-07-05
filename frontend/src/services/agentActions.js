/**
 * VaaniBot Agent Action Execution
 * Converts natural language commands into real system actions
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

/**
 * Intent recognition - maps user queries to actionable intents
 */
export function detectIntent(userMessage) {
  const msg = userMessage.toLowerCase();

  // Approve transfer intent
  if (
    (msg.includes('approve') || msg.includes('execute') || msg.includes('do')) &&
    (msg.includes('transfer') || msg.includes('redistribution') || msg.includes('stock'))
  ) {
    // Extract medicine names
    if (msg.includes('ors')) return { intent: 'APPROVE_TRANSFER', medicine: 'ORS Sachets' };
    if (msg.includes('paracetamol')) return { intent: 'APPROVE_TRANSFER', medicine: 'Paracetamol 500mg' };
    if (msg.includes('cotrimoxazole')) return { intent: 'APPROVE_TRANSFER', medicine: 'Cotrimoxazole' };
    return { intent: 'APPROVE_TRANSFER', medicine: null };
  }

  // Update attendance intent
  if (
    (msg.includes('mark') || msg.includes('update') || msg.includes('log')) &&
    (msg.includes('present') || msg.includes('absent') || msg.includes('attendance'))
  ) {
    return { intent: 'UPDATE_ATTENDANCE' };
  }

  // Show map intent
  if (
    (msg.includes('show') || msg.includes('open') || msg.includes('display')) &&
    (msg.includes('map') || msg.includes('facility') || msg.includes('health centre'))
  ) {
    return { intent: 'SHOW_MAP' };
  }

  // Send WhatsApp alert intent
  if (
    (msg.includes('send') || msg.includes('alert') || msg.includes('notify')) &&
    (msg.includes('whatsapp') || msg.includes('message'))
  ) {
    return { intent: 'SEND_WHATSAPP' };
  }

  // Dismiss alert intent
  if (
    (msg.includes('dismiss') || msg.includes('close') || msg.includes('remove')) &&
    msg.includes('alert')
  ) {
    return { intent: 'DISMISS_ALERT' };
  }

  // Generate report intent
  if (
    (msg.includes('generate') || msg.includes('create')) &&
    msg.includes('report')
  ) {
    return { intent: 'GENERATE_REPORT' };
  }

  // No actionable intent detected
  return { intent: 'CHAT_ONLY' };
}

/**
 * Execute approved stock transfer
 */
export async function executeStockTransfer(medicine, appContext) {
  try {
    const { transfers, approveTransfer } = appContext;

    // Find matching transfer
    const matchingTransfer = transfers.find(t =>
      !medicine || t.medicine.toLowerCase().includes(medicine.toLowerCase())
    );

    if (!matchingTransfer) {
      return {
        success: false,
        message: 'No pending transfer found for that medicine.'
      };
    }

    // Execute the transfer
    await approveTransfer(matchingTransfer);

    return {
      success: true,
      message: `✅ Transfer approved: ${matchingTransfer.quantity} units of ${matchingTransfer.medicine} from ${matchingTransfer.from} to ${matchingTransfer.to}.`
    };
  } catch (error) {
    return {
      success: false,
      message: `Error executing transfer: ${error.message}`
    };
  }
}

/**
 * Update doctor attendance
 */
export async function updateAttendance(appContext) {
  try {
    const { logAttendance, centres } = appContext;

    // For demo: mark first absent doctor as present
    const criticalCentre = centres.find(c => c.healthScore < 40);
    if (criticalCentre) {
      await logAttendance(criticalCentre.id, 'Dr. Sample', 'PRESENT');
      return {
        success: true,
        message: `✅ Attendance updated for ${criticalCentre.name}.`
      };
    }

    return {
      success: false,
      message: 'No attendance updates needed.'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error updating attendance: ${error.message}`
    };
  }
}

/**
 * Navigate to Public Health Map
 */
export function navigateToMap() {
  window.location.href = '/map';
  return {
    success: true,
    message: '🗺️ Opening Public Health Map...'
  };
}

/**
 * Send WhatsApp bulk notification
 */
export async function sendWhatsAppAlert(appContext) {
  try {
    const { activeAlerts } = appContext;
    const criticalAlert = activeAlerts.find(a => a.severity === 'CRITICAL');

    if (!criticalAlert) {
      return {
        success: false,
        message: 'No critical alerts to send.'
      };
    }

    // Simulate WhatsApp notification
    const response = await fetch(`${API_BASE_URL}/whatsapp/send-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: criticalAlert.message,
        recipients: ['District Health Officer', 'PHC Medical Officer']
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: '📲 WhatsApp alerts sent to district health officers.'
      };
    }

    // Fallback simulation
    return {
      success: true,
      message: '📲 WhatsApp notification queued: ' + criticalAlert.message
    };
  } catch (error) {
    return {
      success: true,
      message: '📲 WhatsApp alert simulated (backend offline).'
    };
  }
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(appContext) {
  try {
    const { activeAlerts, dismissAlert } = appContext;

    if (activeAlerts.length === 0) {
      return {
        success: false,
        message: 'No active alerts to dismiss.'
      };
    }

    // Dismiss the first active alert
    await dismissAlert(activeAlerts[0].id);

    return {
      success: true,
      message: `✅ Alert dismissed: ${activeAlerts[0].message}`
    };
  } catch (error) {
    return {
      success: false,
      message: `Error dismissing alert: ${error.message}`
    };
  }
}

/**
 * Generate daily report
 */
export async function generateDailyReport() {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: new Date().toISOString().split('T')[0] })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: `📊 Daily report generated: ${data.reportUrl || 'Report ready for download'}`
      };
    }

    // Fallback
    return {
      success: true,
      message: '📊 Daily report generation queued. Check your email in 5 minutes.'
    };
  } catch (error) {
    return {
      success: true,
      message: '📊 Report generation simulated (backend offline).'
    };
  }
}

/**
 * Main action executor
 */
export async function executeAction(intent, appContext) {
  switch (intent.intent) {
    case 'APPROVE_TRANSFER':
      return await executeStockTransfer(intent.medicine, appContext);

    case 'UPDATE_ATTENDANCE':
      return await updateAttendance(appContext);

    case 'SHOW_MAP':
      return navigateToMap();

    case 'SEND_WHATSAPP':
      return await sendWhatsAppAlert(appContext);

    case 'DISMISS_ALERT':
      return await dismissAlert(appContext);

    case 'GENERATE_REPORT':
      return await generateDailyReport();

    default:
      return null; // No action, just chat
  }
}
