import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sendBulkNotifications } from '../services/cloudFunctions';
import {
  MessageSquare, Send, CheckCircle, Clock, X, Sparkles,
  Bell, AlertTriangle, Users, Phone, ChevronDown, ChevronUp,
  Edit2, Trash2, Plus, Save
} from 'lucide-react';

export default function WhatsAppDashboard() {
  const { language, activeAlerts, centres } = useApp();
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [customMessage, setCustomMessage] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [newContact, setNewContact] = useState('');

  // Recipient groups as state so they can be modified
  const [recipientGroups, setRecipientGroups] = useState([
    {
      id: 'district_officers',
      name: 'District Health Officers',
      contacts: ['+919876543210', '+919876543211', '+919876543212', '+919876543213', '+919876543214']
    },
    {
      id: 'phc_medical_officers',
      name: 'PHC Medical Officers',
      contacts: centres.map((c, i) => `+9198765432${15 + i}`)
    },
    {
      id: 'asha_workers',
      name: 'ASHA Workers',
      contacts: Array.from({ length: 150 }, (_, i) => `+9187654321${String(i).padStart(2, '0')}`)
    },
    {
      id: 'all_staff',
      name: 'All Staff',
      contacts: Array.from({ length: 200 }, (_, i) => `+9176543210${String(i).padStart(2, '0')}`)
    }
  ]);

  // Add new contact to a group
  const handleAddContact = (groupId) => {
    if (!newContact.trim()) return;

    setRecipientGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          contacts: [...group.contacts, newContact.trim()]
        };
      }
      return group;
    }));
    setNewContact('');
  };

  // Delete contact from a group
  const handleDeleteContact = (groupId, contactIndex) => {
    setRecipientGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          contacts: group.contacts.filter((_, idx) => idx !== contactIndex)
        };
      }
      return group;
    }));
  };

  // Edit contact in a group
  const handleEditContact = (groupId, contactIndex, newValue) => {
    setRecipientGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          contacts: group.contacts.map((contact, idx) =>
            idx === contactIndex ? newValue : contact
          )
        };
      }
      return group;
    }));
  };

  const handleSendAlert = async (alert) => {
    setIsSending(true);
    try {
      const recipients = selectedRecipients.flatMap(groupId => {
        const group = recipientGroups.find(g => g.id === groupId);
        return group ? group.contacts : [];
      });

      if (recipients.length === 0) {
        alert('Please select at least one recipient group');
        setIsSending(false);
        return;
      }

      const message = customMessage || alert.message;

      const result = await sendBulkNotifications(recipients, message, 'whatsapp');

      setSentMessages(prev => [{
        id: Date.now(),
        message,
        recipients: selectedRecipients.map(id => recipientGroups.find(g => g.id === id).name).join(', '),
        recipientCount: recipients.length,
        timestamp: new Date().toISOString(),
        status: result.success ? 'SENT' : 'FAILED'
      }, ...prev]);

      setCustomMessage('');
      setSelectedRecipients([]);
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
              <MessageSquare size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">WhatsApp Alert System</h1>
              <p className="text-sm text-gray-600">Send instant notifications to health workers</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel: Send Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Critical Alerts Panel */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="text-red-500" size={20} />
                Critical Alerts - Send via WhatsApp
              </h2>

              {activeAlerts.filter(a => a.severity === 'CRITICAL').length === 0 ? (
                <p className="text-sm text-gray-500">No critical alerts</p>
              ) : (
                <div className="space-y-3">
                  {activeAlerts.filter(a => a.severity === 'CRITICAL').map(alert => (
                    <div
                      key={alert.id}
                      className="rounded-xl border-2 border-red-200 bg-red-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                              CRITICAL
                            </span>
                            <span className="text-xs text-gray-600">{alert.centreName}</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">{alert.message}</p>
                          <p className="text-xs text-gray-600">{alert.recommendation}</p>
                        </div>
                        <button
                          onClick={() => handleSendAlert(alert)}
                          disabled={isSending || selectedRecipients.length === 0}
                          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Send size={14} />
                          Send
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Message Panel */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={20} />
                Compose Custom Message
              </h2>

              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your custom WhatsApp message here..."
                className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                rows={4}
              />

              <button
                onClick={() => handleSendAlert({ message: customMessage })}
                disabled={isSending || !customMessage.trim() || selectedRecipients.length === 0}
                className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <Send size={16} />
                Send Custom Message
              </button>
            </div>

            {/* Sent Messages History */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="text-blue-500" size={20} />
                Sent Messages History
              </h2>

              {sentMessages.length === 0 ? (
                <p className="text-sm text-gray-500">No messages sent yet</p>
              ) : (
                <div className="space-y-3">
                  {sentMessages.map(msg => (
                    <div
                      key={msg.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            msg.status === 'SENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {msg.status === 'SENT' ? <CheckCircle size={12} /> : <X size={12} />}
                            {msg.status}
                          </span>
                          <span className="text-xs text-gray-600">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {msg.recipientCount} recipients
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium mb-1">{msg.message}</p>
                      <p className="text-xs text-gray-600">To: {msg.recipients}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Recipient Groups */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="text-purple-500" size={20} />
                Select Recipients
              </h2>

              <div className="space-y-3">
                {recipientGroups.map(group => (
                  <div key={group.id} className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedRecipients(prev =>
                          prev.includes(group.id)
                            ? prev.filter(id => id !== group.id)
                            : [...prev, group.id]
                        );
                      }}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                        selectedRecipients.includes(group.id)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">{group.name}</span>
                        <div className="flex items-center gap-2">
                          {selectedRecipients.includes(group.id) && (
                            <CheckCircle className="text-emerald-500" size={18} />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedGroup(expandedGroup === group.id ? null : group.id);
                            }}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            {expandedGroup === group.id ? (
                              <ChevronUp size={16} className="text-gray-600" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-600">{group.contacts.length} contacts</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingGroup(editingGroup === group.id ? null : group.id);
                            if (editingGroup !== group.id) {
                              setExpandedGroup(group.id);
                            }
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        >
                          <Edit2 size={12} />
                          <span className="text-[10px] font-bold">
                            {editingGroup === group.id ? 'Done' : 'Edit'}
                          </span>
                        </button>
                      </div>
                    </button>

                    {/* Expandable contact list */}
                    {expandedGroup === group.id && (
                      <div className="rounded-lg border border-gray-200 bg-white p-3 max-h-64 overflow-y-auto">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-gray-700">Contact Numbers:</p>
                          {editingGroup === group.id && (
                            <button
                              onClick={() => setEditingGroup(null)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold transition-colors"
                            >
                              <Save size={10} />
                              Save
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {group.contacts.slice(0, editingGroup === group.id ? undefined : 20).map((contact, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Phone size={10} className="text-emerald-500 flex-shrink-0" />
                              {editingGroup === group.id ? (
                                <>
                                  <input
                                    type="text"
                                    value={contact}
                                    onChange={(e) => handleEditContact(group.id, idx, e.target.value)}
                                    className="flex-1 text-xs text-gray-700 font-mono border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleDeleteContact(group.id, idx)}
                                    className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-gray-600 font-mono">{contact}</span>
                              )}
                            </div>
                          ))}
                          {!editingGroup && group.contacts.length > 20 && (
                            <p className="text-xs text-gray-500 italic pt-1">
                              ... and {group.contacts.length - 20} more contacts
                            </p>
                          )}
                        </div>

                        {/* Add new contact form */}
                        {editingGroup === group.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-bold text-gray-700 mb-2">Add New Contact:</p>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newContact}
                                onChange={(e) => setNewContact(e.target.value)}
                                placeholder="+91XXXXXXXXXX"
                                className="flex-1 text-xs text-gray-700 font-mono border border-gray-300 rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddContact(group.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleAddContact(group.id)}
                                disabled={!newContact.trim()}
                                className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus size={12} />
                                Add
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedRecipients.length > 0 && (
                <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-sm font-bold text-emerald-900 mb-1">
                    Selected: {selectedRecipients.length} group(s)
                  </p>
                  <p className="text-xs text-emerald-700">
                    Total recipients: {selectedRecipients.reduce((sum, id) => {
                      const group = recipientGroups.find(g => g.id === id);
                      return sum + (group?.contacts.length || 0);
                    }, 0)}
                  </p>
                </div>
              )}
            </div>

            {/* Stats Panel */}
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">WhatsApp Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-extrabold">{sentMessages.length}</p>
                  <p className="text-xs text-emerald-100">Messages Sent Today</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold">
                    {sentMessages.reduce((sum, msg) => sum + msg.recipientCount, 0)}
                  </p>
                  <p className="text-xs text-emerald-100">Total Recipients Reached</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold">
                    {((sentMessages.filter(m => m.status === 'SENT').length / (sentMessages.length || 1)) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-emerald-100">Delivery Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
