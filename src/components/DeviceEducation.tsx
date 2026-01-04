
import { Clock, Zap, FileText, Sparkles, Bell, Settings, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import DeviceScenarios from './DeviceScenarios';

interface EducationSection {
  icon: typeof Clock;
  title: string;
  content: string;
  highlight?: string;
}

export function RealTimeBehaviorSection() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
          <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Data Transmission Modes
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            After connecting, the device can transmit data either daily, several times a day, or in real time, depending on the sensor type and selected settings.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-green-700 dark:text-green-400">Continuous Monitoring:</strong> If the device supports continuous monitoring (e.g., Dexcom, Libre, or some bracelets), BioMath Core can react immediately when a metric goes outside the normal range. The reaction is not a medical diagnosis — it is an explanation of the trend and a suggestion on how to adjust behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataInfluenceReportsSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Influence on Reports
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            When a user creates a new report, connected devices automatically provide additional contextual data. This allows the AI to form conclusions not only based on questionnaires and the user's words but also on real physiological signals. Reports become more accurate and personal.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DataInfluenceAISection() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Influence on AI Assistant
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            In the AI Assistant chat, it can rely on current metrics. If, for example, HRV drops for several days in a row, the AI suggests that the nervous system is overloaded and recommends recovery. If glucose is unstable, the AI explains why and what steps will help smooth out the spikes.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-purple-700 dark:text-purple-400">Second Opinion:</strong> If a second opinion is enabled, both opinions consider the same data but explain it with different approaches: a strict physiological analysis and an adaptive behavioral explanation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertsNudgesSection() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
          <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Soft Hints and Nudges
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            The user can enable soft nudges — short tips when metrics are heading in an unfavorable direction. This is not an alarm or a diagnosis. It is a gentle reminder that it is worth taking a step towards stabilization: rest, breathe, drink water, take a walk, or reduce the load.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-orange-700 dark:text-orange-400">Positive Reinforcement:</strong> If the metrics improve sharply, we also report it. This strengthens motivation and forms positive reinforcement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserSettingsSection() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Synchronization Settings
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The user decides what data to use and in what mode:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Only at night</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">For sleep analysis</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Only in the morning</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">For recovery analysis</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Every few hours</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">General dynamics</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Continuously</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">If the sensor supports it</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Settings can be changed without reconnecting the device.
          </p>
        </div>
      </div>
    </div>
  );
}

export function WhyDevicesMatterSection() {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-teal-200 dark:border-teal-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Why Devices Matter
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Devices eliminate guesswork. Health becomes a measurable process, not just a set of feelings. This helps to notice early signals, not just symptoms, while everything can still be corrected without stress and intervention.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdvancedBehaviorNote() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
            Advanced Analytics
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Some devices can provide more parameters than others. The platform should not impose an additional interface: if there is extra data, it enriches the analytics but does not complicate its use. The interface remains the same, regardless of the data depth.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DeviceEducation() {
  return (
    <div className="space-y-6">
      <WhyDevicesMatterSection />
      <RealTimeBehaviorSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataInfluenceReportsSection />
        <DataInfluenceAISection />
      </div>

      <AlertsNudgesSection />
      <UserSettingsSection />

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Examples of Real Scenarios
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              How the platform reacts to changes in device data. All reactions are formulated in a soft, non-alarmist form — as hints, not diagnoses.
            </p>
          </div>
        </div>
        <DeviceScenarios />
      </div>

      <AdvancedBehaviorNote />
    </div>
  );
}
