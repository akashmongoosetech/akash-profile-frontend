import { Video, GraduationCap, Users, Award } from 'lucide-react';

export const eventTypeConfig = {
  webinar: {
    icon: Video,
    label: 'Webinar',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  workshop: {
    icon: GraduationCap,
    label: 'Workshop',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  'office-hours': {
    icon: Users,
    label: 'Office Hours',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  conference: {
    icon: Award,
    label: 'Conference',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  }
} as const;

export type EventType = keyof typeof eventTypeConfig;
