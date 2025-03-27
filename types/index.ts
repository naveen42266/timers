// types.ts
// export type RootStackParamList = {
//   Home: undefined;
//   AddTimer: undefined;
//   Timers: undefined;
// };


export type Timer = {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  status: 'running' | 'paused' | 'completed';
  halfwayAlert: boolean;
  halfwayTriggered: boolean;
};

export type HistoryItem = {
  name: string;
  category: string;
  completedAt: string;
};

export type RootStackParamList = {
  Home: undefined;
  AddTimer: { addNewTimer: (timer: Timer) => void };
  History: undefined;
  Timers: undefined;
};