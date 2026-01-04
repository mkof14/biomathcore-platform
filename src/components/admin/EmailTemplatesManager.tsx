
import { useState, useEffect } from 'react';
import { Mail, Plus, Edit2, Trash2, Send, Eye, Search, Filter, Download, Upload, RefreshCw, Rocket } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { seedEmailTemplates } from '../../lib/emailTemplates';

// Helper function to convert HTML to plain text
function htmlToPlainText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/div>/ig, '\n')
    .replace(/<\/li>/ig, '\n')
    .replace(/<li[^>]*>/ig, '  * ')
    .replace(/<\/ul>/ig, '\n')
    .replace(/<\/p>/ig, '\n')
    .replace(/<br\s*[/]?>/ig, '\n')
    .replace(/<[^>]+>/ig, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  subject_en: string;
  subject_ru: string | null;
  body_en: string;
  body_ru: string | null;
  variable_schema: Array<{ key: string; type: string; required: boolean }>;
  status: 'draft' | 'active' | 'archived';
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface EmailLog {
  id: string;
  template_id: string | null;
  recipient_email: string;
  subject: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: 'welcome', label: 'Welcome' },
  { value: 'payment_success', label: 'Payment Success' },
  { value: 'payment_failed', label: 'Payment Failed' },
  { value: 'password_reset', label: 'Password Reset' },
  { value: 'billing_invoice', label: 'Billing Invoice' },
  { value: 'subscription_update', label: 'Subscription Update' },
  { value: 'general', label: 'General' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'notification', label: 'Notification' },
];

export default function EmailTemplatesManager() {
  const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'general',
    subject_en: '',
    body_en: '',
    variables: '',
    status: 'draft',
    description: '',
  });
  const [sendFormData, setSendFormData] = useState({
    recipientEmail: '',
    customSubject: '',
    customBody: '',
  });

  useEffect(() => {
    loadTemplates();
    loadLogs();
  }, []);

  const handleSeedTemplates = async () => {
    if (!confirm('This will add/update all 38 default email templates. Continue?')) return;

    try {
      setLoading(true);
      const results = await seedEmailTemplates(supabase);
      const successCount = results.filter(r => r.success).length;
      alert(`Successfully seeded ${successCount}/${results.length} templates!`);
      loadTemplates();
    } catch (error) {
      console.error('Error seeding templates:', error);
      alert('Failed to seed templates');
    } finally {
      setLoading(false);
    }
  };

  const handleExportTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*');

      if (error) throw error;

      const exportData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        templates: data,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-templates-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting templates:', error);
      alert('Failed to export templates');
    }
  };

  const handleImportTemplates = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.templates || !Array.isArray(importData.templates)) {
        throw new Error('Invalid template file format');
      }

      const { error } = await supabase
        .from('email_templates')
        .upsert(importData.templates, { onConflict: 'slug' });

      if (error) throw error;

      alert(`Successfully imported ${importData.templates.length} templates!`);
      loadTemplates();
    } catch (error) {
      console.error('Error importing templates:', error);
      alert('Failed to import templates');
    }

    event.target.value = '';
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('email_sends')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const openCreateModal = () => {
    setSelectedTemplate(null);
    setFormData({
      name: '',
      slug: '',
      category: 'general',
      subject_en: '',
      body_en: '',
      variables: '',
      status: 'draft',
      description: '',
    });
    setShowTemplateModal(true);
  };

  const openEditModal = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    const variableKeys = template.variable_schema?.map(v => v.key).join(', ') || '';
    setFormData({
      name: template.name,
      slug: template.slug,
      category: template.category,
      subject_en: template.subject_en,
      body_en: template.body_en,
      variables: variableKeys,
      status: template.status,
      description: template.description || '',
    });
    setShowTemplateModal(true);
  };

  const openSendModal = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSendFormData({
      recipientEmail: '',
      customSubject: template.subject_en,
      customBody: template.body_en,
    });
    setShowSendModal(true);
  };

  const handleSaveTemplate = async () => {
    try {
      const variablesArray = formData.variables
        .split(',')
        .map(v => v.trim())
        .filter(v => v);

      const variableSchema = variablesArray.map(key => ({
        key,
        type: 'string',
        required: true
      }));

      const templateData = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        subject_en: formData.subject_en,
        subject_ru: null,
        body_en: formData.body_en,
        body_ru: null,
        variable_schema: variableSchema,
        status: formData.status as 'draft' | 'active' | 'archived',
        description: formData.description || null,
      };

      if (selectedTemplate) {
        const { error } = await supabase
          .from('email_templates')
          .update(templateData)
          .eq('id', selectedTemplate.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert(templateData);

        if (error) throw error;
      }

      setShowTemplateModal(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate || !sendFormData.recipientEmail) {
      alert('Please provide recipient email');
      return;
    }

    try {
      const response = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: sendFormData.recipientEmail,
          subject: sendFormData.customSubject,
          html: sendFormData.customBody,
        }),
      });

      const result = await response.json();
      const success = response.ok;
      
      const { error: logError } = await supabase.from('email_sends').insert({
        template_id: selectedTemplate.id,
        recipient_email: sendFormData.recipientEmail,
        subject: sendFormData.customSubject,
        body_html: sendFormData.customBody,
        body_text: htmlToPlainText(sendFormData.customBody),
        variables_used: {},
        send_type: 'test',
        status: success ? 'sent' : 'failed',
        provider: 'resend',
        provider_message_id: result.messageId || null,
        sent_at: success ? new Date().toISOString() : null,
        error_message: result.error ? (result.details || result.error) : null,
      });

      if (logError) console.error('Error logging email:', logError);

      if (success) {
        alert(`Email sent successfully via Resend!`);
        setShowSendModal(false);
        loadLogs();
      } else {
        alert(`Failed to send email: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      alert('Failed to send email: ' + error.message);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Mail className="w-8 h-8 text-gray-700" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Email Templates Manager</h1>
                <p className="text-sm text-gray-500">Create, manage, and send email templates.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={loadTemplates} className="p-2 rounded-md hover:bg-gray-200 transition-colors"><RefreshCw className="w-5 h-5 text-gray-600" /></button>
              <button onClick={handleExportTemplates} className="p-2 rounded-md hover:bg-gray-200 transition-colors"><Download className="w-5 h-5 text-gray-600" /></button>
              <label className="p-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-gray-600" />
                <input type="file" accept=".json" onChange={handleImportTemplates} className="hidden" />
              </label>
              <button onClick={openCreateModal} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                New Template
              </button>
               <button onClick={handleSeedTemplates} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                <Rocket className="w-5 h-5 mr-2" />
                Seed Templates
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 p-4">
              <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'templates' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                Templates
              </button>
              <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'logs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                Send Logs
              </button>
            </nav>
          </div>

          {activeTab === 'templates' && (
            <div>
              <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <div className="relative w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search templates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? <p className="p-4 text-center">Loading templates...</p> :
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Subject</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Last Updated</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTemplates.map(template => (
                        <tr key={template.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{template.name}</td>
                          <td className="px-6 py-4">{template.category}</td>
                          <td className="px-6 py-4">{template.subject_en}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {template.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">{new Date(template.updated_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button onClick={() => openSendModal(template)} className="p-2 rounded-md hover:bg-gray-200"><Send className="w-4 h-4 text-blue-600"/></button>
                              <button onClick={() => openEditModal(template)} className="p-2 rounded-md hover:bg-gray-200"><Edit2 className="w-4 h-4 text-yellow-600"/></button>
                              <button onClick={() => handleDeleteTemplate(template.id)} className="p-2 rounded-md hover:bg-gray-200"><Trash2 className="w-4 h-4 text-red-600"/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            </div>
          )}
          
          {activeTab === 'logs' && (
             <div className="overflow-x-auto">
                {loading ? <p className="p-4 text-center">Loading logs...</p> :
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Recipient</th>
                            <th scope="col" className="px-6 py-3">Subject</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Sent At</th>
                        </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{log.recipient_email}</td>
                          <td className="px-6 py-4">{log.subject}</td>
                           <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">{log.sent_at ? new Date(log.sent_at).toLocaleString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
          )}
        </div>
      </div>

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">{selectedTemplate ? 'Edit Template' : 'Create Template'}</h2>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                   {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject (EN)</label>
                <input type="text" value={formData.subject_en} onChange={e => setFormData({...formData, subject_en: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Body (EN) - HTML supported</label>
                <textarea rows={10} value={formData.body_en} onChange={e => setFormData({...formData, body_en: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-mono"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Variables (comma-separated)</label>
                <input type="text" value={formData.variables} onChange={e => setFormData({...formData, variables: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                   <option value="draft">Draft</option>
                   <option value="active">Active</option>
                   <option value="archived">Archived</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
              <button onClick={() => setShowTemplateModal(false)} className="px-4 py-2 bg-white border rounded-md text-sm">Cancel</button>
              <button onClick={handleSaveTemplate} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Save Template</button>
            </div>
          </div>
        </div>
      )}

      {showSendModal && selectedTemplate && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Send Test Email</h2>
              <p className="text-sm text-gray-500">Template: {selectedTemplate.name}</p>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
               <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Email</label>
                <input type="email" value={sendFormData.recipientEmail} onChange={e => setSendFormData({...sendFormData, recipientEmail: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" value={sendFormData.customSubject} onChange={e => setSendFormData({...sendFormData, customSubject: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Body</label>
                <textarea rows={10} value={sendFormData.customBody} onChange={e => setSendFormData({...sendFormData, customBody: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-mono"></textarea>
              </div>
            </div>
             <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
              <button onClick={() => setShowSendModal(false)} className="px-4 py-2 bg-white border rounded-md text-sm">Cancel</button>
              <button onClick={handleSendEmail} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Send Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
