'use client';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 dark:from-blue-900 dark:via-indigo-800 dark:to-purple-700 opacity-30 animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-50 via-pink-100 to-rose-200 dark:from-purple-900 dark:via-pink-800 dark:to-rose-700 opacity-20 animate-gradient-shift-reverse" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-float-slow" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-float-medium" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-25 animate-float-slow" />
      <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-25 animate-float-medium" />
      
      <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-cyan-400 dark:bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-2xl opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-violet-400 dark:bg-violet-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-2xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
    </div>
  );
};

