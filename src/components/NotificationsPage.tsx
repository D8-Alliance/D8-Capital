import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { useI18n } from '../i18n';
import { DemoDataLabel } from './DemoDataLabel';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigateToApp: (appId?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigateToApp }) => {
  const { state, markNotificationRead } = useDemoStore();
  const { t } = useI18n();

  const userNotifications = state.notifications.filter(
    (n) => n.role === state.activeRole || n.userId === state.activeUser.id
  );

  const handleMarkAllRead = () => {
    userNotifications.forEach((n) => markNotificationRead(n.id));
  };

  return (
    <div id="notifications-page" className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('nav.notifications')}
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates, offer alerts, and verification notices
          </p>
        </div>

        {userNotifications.length > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
          >
            Mark All Read
          </button>
        )}
      </div>

      {userNotifications.length > 0 ? (
        <div className="space-y-3">
          {userNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.relatedApplicationId) {
                  onNavigateToApp(n.relatedApplicationId);
                }
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  n.type === 'ACTION_REQUIRED'
                    ? 'bg-amber-500 text-slate-950 animate-bounce'
                    : n.type === 'SUCCESS'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {n.type === 'ACTION_REQUIRED' ? (
                  <Sparkles className="w-5 h-5" />
                ) : n.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                {n.relatedApplicationId && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950">
                      <span>View Application</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-500">You are all caught up!</p>
        </div>
      )}
    </div>
  );
};
