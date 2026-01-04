import { TrendingUp, TrendingDown, Minus, Droplet, Moon, Heart, Activity, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ScenarioCardProps {
  title: string;
  description: string;
  aiResponse: string;
  secondOpinion?: string;
  type: 'spike' | 'stabilized' | 'declined' | 'improved' | 'balanced' | 'overload';
  icon: typeof Droplet;
  category: 'cgm' | 'sleep_hrv' | 'activity';
}

function ScenarioCard({ title, description, aiResponse, secondOpinion, type, icon: Icon, category }: ScenarioCardProps) {
  const { t } = useTranslation();
  const typeStyles = {
    spike: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
    },
    declined: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
    },
    stabilized: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
    },
    improved: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
    },
    balanced: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
    },
    overload: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
    }
  };

  const style = typeStyles[type];

  return (
    <div className={`${style.bg} rounded-xl p-6 border ${style.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className={`${style.iconBg} rounded-lg p-3 flex-shrink-0`}>
            <Icon className={`h-6 w-6 ${style.iconColor}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
              {title}
            </h3>
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${style.badge}`}>
              {t(`deviceScenarios.category.${category}`)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            <strong className="text-gray-900 dark:text-white">{t('deviceScenarios.systemDescription')}</strong>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {description}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {t('deviceScenarios.aiReaction')}
            </p>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            "{aiResponse}"
          </p>
        </div>

        {secondOpinion && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-400 mb-2">
              {t('deviceScenarios.secondOpinionOffer')}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              "{secondOpinion}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CGMScenarios() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Droplet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('deviceScenarios.cgm.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {t('deviceScenarios.cgm.description')}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-purple-700 dark:text-purple-400">{t('deviceScenarios.cgm.systemBehavior')}</strong>
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2 ml-4">
                <li>• {t('deviceScenarios.cgm.systemBehavior.item1')}</li>
                <li>• {t('deviceScenarios.cgm.systemBehavior.item2')}</li>
                <li>• {t('deviceScenarios.cgm.systemBehavior.item3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScenarioCard
          title={t('deviceScenarios.cgm.spike.title')}
          description={t('deviceScenarios.cgm.spike.description')}
          aiResponse={t('deviceScenarios.cgm.spike.aiResponse')}
          secondOpinion={t('deviceScenarios.cgm.spike.secondOpinion')}
          type="spike"
          icon={TrendingUp}
          category="cgm"
        />

        <ScenarioCard
          title={t('deviceScenarios.cgm.stabilization.title')}
          description={t('deviceScenarios.cgm.stabilization.description')}
          aiResponse={t('deviceScenarios.cgm.stabilization.aiResponse')}
          type="stabilized"
          icon={Minus}
          category="cgm"
        />
      </div>
    </div>
  );
}

export function SleepHRVScenarios() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Moon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('deviceScenarios.sleep_hrv.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t('deviceScenarios.sleep_hrv.description')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScenarioCard
          title={t('deviceScenarios.sleep_hrv.deterioration.title')}
          description={t('deviceScenarios.sleep_hrv.deterioration.description')}
          aiResponse={t('deviceScenarios.sleep_hrv.deterioration.aiResponse')}
          secondOpinion={t('deviceScenarios.sleep_hrv.deterioration.secondOpinion')}
          type="declined"
          icon={TrendingDown}
          category="sleep_hrv"
        />

        <ScenarioCard
          title={t('deviceScenarios.sleep_hrv.improvement.title')}
          description={t('deviceScenarios.sleep_hrv.improvement.description')}
          aiResponse={t('deviceScenarios.sleep_hrv.improvement.aiResponse')}
          type="improved"
          icon={TrendingUp}
          category="sleep_hrv"
        />
      </div>
    </div>
  );
}

export function ActivityScenarios() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('deviceScenarios.activity.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t('deviceScenarios.activity.description')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ScenarioCard
          title={t('deviceScenarios.activity.overload.title')}
          description={t('deviceScenarios.activity.overload.description')}
          aiResponse={t('deviceScenarios.activity.overload.aiResponse')}
          type="overload"
          icon={TrendingUp}
          category="activity"
        />

        <ScenarioCard
          title={t('deviceScenarios.activity.balance.title')}
          description={t('deviceScenarios.activity.balance.description')}
          aiResponse={t('deviceScenarios.activity.balance.aiResponse')}
          type="balanced"
          icon={Minus}
          category="activity"
        />

        <ScenarioCard
          title={t('deviceScenarios.activity.fatigue.title')}
          description={t('deviceScenarios.activity.fatigue.description')}
          aiResponse={t('deviceScenarios.activity.fatigue.aiResponse')}
          type="declined"
          icon={TrendingDown}
          category="activity"
        />
      </div>
    </div>
  );
}

export function GeneralScenarioLogic() {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-teal-200 dark:border-teal-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
          <Heart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {t('deviceScenarios.generalLogic.title')}
          </h2>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-teal-200 dark:border-teal-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong className="text-teal-700 dark:text-teal-400">{t('deviceScenarios.generalLogic.safeLanguage.title')}</strong>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('deviceScenarios.generalLogic.safeLanguage.description')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-teal-200 dark:border-teal-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong className="text-teal-700 dark:text-teal-400">{t('deviceScenarios.generalLogic.dynamics.title')}</strong>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('deviceScenarios.generalLogic.dynamics.description')}
              </p>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-300 dark:border-teal-700">
              <p className="text-sm font-semibold text-teal-900 dark:text-teal-400 mb-2">
                {t('deviceScenarios.generalLogic.keyTerms.title')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('deviceScenarios.generalLogic.keyTerms.term1')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('deviceScenarios.generalLogic.keyTerms.term2')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('deviceScenarios.generalLogic.keyTerms.term3')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('deviceScenarios.generalLogic.keyTerms.term4')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('deviceScenarios.generalLogic.keyTerms.term5')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('deviceScenarios.generalLogic.keyTerms.term6')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-teal-300 dark:border-teal-700">
              <div className="flex items-start space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {t('deviceScenarios.generalLogic.neverUse.title')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded line-through">
                  {t('deviceScenarios.generalLogic.neverUse.term1')}
                </span>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded line-through">
                  {t('deviceScenarios.generalLogic.neverUse.term2')}
                </span>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded line-through">
                  {t('deviceScenarios.generalLogic.neverUse.term3')}
                </span>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded line-through">
                  {t('deviceScenarios.generalLogic.neverUse.term4')}
                </span>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded line-through">
                  {t('deviceScenarios.generalLogic.neverUse.term5')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeviceScenarios() {
  return (
    <div className="space-y-8">
      <GeneralScenarioLogic />
      <CGMScenarios />
      <SleepHRVScenarios />
      <ActivityScenarios />
    </div>
  );
}
