const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

export const ENV = {
  SUPABASE_URL: getEnvVar('REACT_APP_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('REACT_APP_SUPABASE_ANON_KEY'),
  RESEND_API_KEY: getEnvVar('REACT_APP_RESEND_API_KEY'),
  STRIPE_SECRET_KEY: getEnvVar('REACT_APP_STRIPE_SECRET_KEY'),
  STRIPE_PUBLISHABLE_KEY: getEnvVar('REACT_APP_STRIPE_PUBLISHABLE_KEY'),
  OPENAI_API_KEY: getEnvVar('REACT_APP_OPENAI_API_KEY'),
};
