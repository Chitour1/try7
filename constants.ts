import { SRSStage, LibraryGroup } from './types';

export const SRS_STAGES: SRSStage[] = [
    { name: "مرحلة التعلم", intervalDays: 1, reps: 6 },
    { name: "مراجعة اليوم التالي", intervalDays: 1, reps: 4 },
    { name: "مراجعة بعد 3 أيام", intervalDays: 7, reps: 3 },
    { name: "مراجعة بعد 7 أيام", intervalDays: 19, reps: 2 },
    { name: "مراجعة بعد 30 يومًا", intervalDays: 30, reps: 2 },
    { name: "مرحلة الإتقان", intervalDays: Infinity, reps: 0 }
];

export const LIBRARY_INDEX_URL = 'https://cdn.jsdelivr.net/gh/Chitour1/english2@main/main_library3.js';