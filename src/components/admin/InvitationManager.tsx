
import { useState, useEffect } from 'react';
import { Mail, Gift, UserPlus, Calendar, Clock, CheckCircle, XCircle, Copy, Send, Trash2, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Invitation {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  code: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  plan_type: 'core' | 'daily' | 'max';
  duration_months: number;
  expires_at: string | null;
  accepted_at: string | null;
  accepted_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  language: 'en' | 'ru';
}

interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
  revoked: number;
}

export default function InvitationManager() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<InvitationStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    expired: 0,
    revoked: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'expired' | 'revoked'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [newInvitation, setNewInvitation] = useState({
    email: '',
    first_name: '',
    last_name: '',
    plan_type: 'core' as 'core' | 'daily' | 'max',
    duration_months: 3,
    expires_in_days: 30,
    notes: '',
    send_email: true,
    language: 'en' as 'en' | 'ru',
  });

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const invitationsData = data || [];
      setInvitations(invitationsData as Invitation[]);

      const calculatedStats: InvitationStats = {
        total: invitationsData.length,
        pending: invitationsData.filter(i => i.status === 'pending').length,
        accepted: invitationsData.filter(i => i.status === 'accepted').length,
        expired: invitationsData.filter(i => i.status === 'expired').length,
        revoked: invitationsData.filter(i => i.status === 'revoked').length,
      };

      setStats(calculatedStats);
    } catch (err: any) {
      console.error('Error loading invitations:', err);
      setError('Failed to load invitations. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateInvitationCode = async () => {
    const { data, error } = await supabase.rpc('generate_invitation_code');
    if (error) throw new Error('Failed to generate invitation code: ' + error.message);
    return data;
  };

  const sendInvitationEmail = async (invitation: Invitation) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', user!.id).single();

      const response = await fetch('/api/send-templated-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: invitation.email,
          templateSlug: 'user-invitation',
          templateData: {
            recipient_name: invitation.first_name || invitation.email,
            inviter_name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'A team member',
            invitation_code: invitation.code,
            plan_name: getPlanName(invitation.plan_type),
            duration: getDurationText(invitation.duration_months),
            redemption_link: `${window.location.origin}/#/redeem-invitation?code=${invitation.code}`
          },
          language: invitation.language,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation email.');
      }

      console.log('Invitation email sent successfully:', result.message);
      return result;

    } catch (err: any) {
      console.error('Error in sendInvitationEmail:', err);
      throw err;
    }
  };


  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      if (!newInvitation.email) {
        throw new Error('Email is required');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const code = await generateInvitationCode();
      const expiresAt = newInvitation.expires_in_days > 0
        ? new Date(Date.now() + newInvitation.expires_in_days * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data: newInvitationData, error } = await supabase
        .from('invitations')
        .insert({
          email: newInvitation.email,
          first_name: newInvitation.first_name || null,
          last_name: newInvitation.last_name || null,
          code: code,
          invited_by: user.id,
          plan_type: newInvitation.plan_type,
          duration_months: newInvitation.duration_months,
          expires_at: expiresAt,
          notes: newInvitation.notes || null,
          status: 'pending',
          language: newInvitation.language,
        })
        .select()
        .single();

      if (error) throw error;

      if (newInvitation.send_email) {
        await sendInvitationEmail(newInvitationData as Invitation);
      }

      setNewInvitation({
        email: '',
        first_name: '',
        last_name: '',
        plan_type: 'core',
        duration_months: 3,
        expires_in_days: 30,
        notes: '',
        send_email: true,
        language: 'en',
      });
      setShowCreateModal(false);
      loadInvitations();
      alert(`Invitation created successfully! Code: ${code}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create invitation');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}/#/redeem-invitation?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRevokeInvitation = async (id: string, email: string) => {
    if (!confirm(`Revoke invitation for ${email}?`)) return;

    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'revoked', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      loadInvitations();
      alert('Invitation revoked successfully');
    } catch (err: any) {
      console.error('Error revoking invitation:', err);
      alert('Failed to revoke invitation: ' + err.message);
    }
  };

  const handleResendEmail = async (invitation: Invitation) => {
    try {
      await sendInvitationEmail(invitation);
      alert('Invitation email re-sent successfully!');
    } catch (err: any) {
      console.error('Error resending email:', err);
      alert('Failed to resend invitation: ' + err.message);
    }
  };

  const handleDeleteInvitation = async (id: string, email: string) => {
    if (!confirm(`Delete invitation for ${email}? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadInvitations();
      alert('Invitation deleted successfully');
    } catch (err: any) {
      console.error('Error deleting invitation:', err);
      alert('Failed to delete invitation: ' + err.message);
    }
  };

  const getFilteredInvitations = () => {
    if (filter === 'all') return invitations;
    return invitations.filter(i => i.status === filter);
  };

  const getPlanName = (planType: string) => {
    const plans: Record<string, string> = {
      core: 'Core Plan',
      daily: 'Daily Plan',
      max: 'Max Plan',
    };
    return plans[planType] || planType;
  };

  const getDurationText = (months: number) => {
    if (months === 0) return 'Forever';
    if (months === 1) return '1 month';
    if (months === 12) return '1 year';
    return `${months} months`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-900/30 border-yellow-600/30 text-yellow-400',
      accepted: 'bg-green-900/30 border-green-600/30 text-green-400',
      expired: 'bg-gray-700/30 border-gray-600/30 text-gray-400',
      revoked: 'bg-red-900/30 border-red-600/30 text-red-400',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-3 w-3" />;
      case 'revoked': return <XCircle className="h-3 w-3" />;
      case 'expired': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const filteredInvitations = getFilteredInvitations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Gift className="h-7 w-7 text-purple-400" />
          Invitation Manager
        </h2>
        <div className="flex gap-3">
          <button
            onClick={loadInvitations}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Create Invitation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total</h3>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        {/* Pending */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-gray-950 border border-yellow-700/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-yellow-400 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        {/* Accepted */}
        <div className="bg-gradient-to-br from-green-900/20 to-gray-950 border border-green-700/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-green-400 mb-2">Accepted</h3>
          <p className="text-3xl font-bold text-green-400">{stats.accepted}</p>
        </div>
        {/* Expired */}
        <div className="bg-gradient-to-br from-gray-800/20 to-gray-950 border border-gray-700/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Expired</h3>
          <p className="text-3xl font-bold text-gray-400">{stats.expired}</p>
        </div>
        {/* Revoked */}
        <div className="bg-gradient-to-br from-red-900/20 to-gray-950 border border-red-700/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-red-400 mb-2">Revoked</h3>
          <p className="text-3xl font-bold text-red-400">{stats.revoked}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">All Invitations</h3>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading invitations...</div>
        ) : filteredInvitations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No invitations found for this filter.</div>
        ) : (
          <div className="space-y-3">
            {filteredInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="p-4 rounded-lg border bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-white">
                        {invitation.first_name || invitation.last_name
                          ? `${invitation.first_name || ''} ${invitation.last_name || ''}`.trim()
                          : invitation.email}
                      </h3>
                      {(invitation.first_name || invitation.last_name) && (
                        <span className="text-sm text-gray-400">({invitation.email})</span>
                      )}
                      <span className={`px-2 py-0.5 border text-xs rounded-full flex items-center gap-1 ${getStatusColor(invitation.status)}`}>
                        {getStatusIcon(invitation.status)}
                        {invitation.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Invitation Code</p>
                        <div className="flex items-center gap-2">
                          <p className="text-purple-400 font-mono font-bold">{invitation.code}</p>
                          <button
                            onClick={() => handleCopyCode(invitation.code)}
                            className="text-gray-400 hover:text-purple-400 transition-colors"
                            title="Copy Code"
                          >
                            {copiedCode === invitation.code ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Plan & Duration</p>
                        <p className="text-gray-300">
                          {getPlanName(invitation.plan_type)} - {getDurationText(invitation.duration_months)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Created</p>
                        <p className="text-gray-300">{new Date(invitation.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expires</p>
                        <p className="text-gray-300">
                          {invitation.expires_at ? new Date(invitation.expires_at).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>

                    {invitation.notes && (
                      <div className="mb-3">
                        <p className="text-gray-500 text-sm">Notes</p>
                        <p className="text-gray-300 text-sm">{invitation.notes}</p>
                      </div>
                    )}

                    {invitation.status === 'accepted' && invitation.accepted_at && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Accepted on {new Date(invitation.accepted_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {invitation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleCopyLink(invitation.code)}
                          className="p-2 bg-purple-600/20 border border-purple-600/30 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                          title="Copy Invitation Link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleResendEmail(invitation)}
                          className="p-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                          title="Resend Email"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRevokeInvitation(invitation.id, invitation.email)}
                          className="p-2 bg-red-600/20 border border-red-600/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                          title="Revoke Invitation"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteInvitation(invitation.id, invitation.email)}
                      className="p-2 bg-gray-700/50 border border-gray-600/30 text-gray-400 rounded-lg hover:bg-gray-600/50 transition-colors"
                      title="Delete Invitation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Gift className="h-6 w-6 text-purple-400" />
              Create New Invitation
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleCreateInvitation} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newInvitation.first_name}
                    onChange={(e) => setNewInvitation({ ...newInvitation, first_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newInvitation.last_name}
                    onChange={(e) => setNewInvitation({ ...newInvitation, last_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newInvitation.email}
                  onChange={(e) => setNewInvitation({ ...newInvitation, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={newInvitation.language}
                  onChange={(e) => setNewInvitation({ ...newInvitation, language: e.target.value as 'en' | 'ru' })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="en">English</option>
                  <option value="ru">Russian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan Type
                </label>
                <select
                  value={newInvitation.plan_type}
                  onChange={(e) => setNewInvitation({ ...newInvitation, plan_type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="core">Core</option>
                  <option value="daily">Daily</option>
                  <option value="max">Max</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newInvitation.duration_months}
                    onChange={(e) => setNewInvitation({ ...newInvitation, duration_months: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">0 for forever</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expires In (Days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newInvitation.expires_in_days}
                    onChange={(e) => setNewInvitation({ ...newInvitation, expires_in_days: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                   <p className="text-xs text-gray-400 mt-1">0 for no expiry</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={newInvitation.notes}
                  onChange={(e) => setNewInvitation({ ...newInvitation, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Internal notes for this invitation..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="send_email"
                  type="checkbox"
                  checked={newInvitation.send_email}
                  onChange={(e) => setNewInvitation({ ...newInvitation, send_email: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="send_email" className="text-sm text-gray-300">
                  Send invitation email to the user
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                    setNewInvitation({
                      email: '',
                      first_name: '',
                      last_name: '',
                      plan_type: 'core',
                      duration_months: 3,
                      expires_in_days: 30,
                      notes: '',
                      send_email: true,
                      language: 'en',
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
