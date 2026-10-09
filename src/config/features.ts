import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BellRing,
  CalendarDays,
  ClipboardList,
  CreditCard,
  DoorOpen,
  FolderHeart,
  HeartPulse,
  Home as HomeIcon,
  Pill,
  Stethoscope,
  UserPlus,
  Users,
} from 'lucide-react';
import type { ScreenId } from '../app/components/PhoneMockup';

export interface FeatureItem {
  id: string;
  /** Which stylized phone screen this feature shows. */
  screen: ScreenId;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

/**
 * The exact set of LIVE app features (nothing invented). Every feature found in
 * the existing copy is listed here and showcased on the landing page.
 */
export const patientFeatures: FeatureItem[] = [
  {
    id: 'appointment',
    screen: 'appointment',
    icon: CalendarDays,
    titleKey: 'home.showcase.features.appointment.title',
    descKey: 'home.showcase.features.appointment.description',
  },
  {
    id: 'medicalRecords',
    screen: 'records',
    icon: FolderHeart,
    titleKey: 'home.showcase.features.medicalRecords.title',
    descKey: 'home.showcase.features.medicalRecords.description',
  },
  {
    id: 'prescription',
    screen: 'prescription',
    icon: Pill,
    titleKey: 'home.showcase.features.prescription.title',
    descKey: 'home.showcase.features.prescription.description',
  },
  {
    id: 'notifications',
    screen: 'notifications',
    icon: BellRing,
    titleKey: 'home.showcase.features.notifications.title',
    descKey: 'home.showcase.features.notifications.description',
  },
  {
    id: 'payment',
    screen: 'payment',
    icon: CreditCard,
    titleKey: 'home.showcase.features.payment.title',
    descKey: 'home.showcase.features.payment.description',
  },
  {
    id: 'homeCare',
    screen: 'homecare',
    icon: HomeIcon,
    titleKey: 'home.showcase.features.homeCare.title',
    descKey: 'home.showcase.features.homeCare.description',
  },
  {
    id: 'followUp',
    screen: 'followup',
    icon: Activity,
    titleKey: 'home.showcase.features.followUp.title',
    descKey: 'home.showcase.features.followUp.description',
  },
];

export const professionalFeatures: FeatureItem[] = [
  {
    id: 'morePatients',
    screen: 'dashboard',
    icon: Users,
    titleKey: 'home.showcase.professionals.morePatients.title',
    descKey: 'home.showcase.professionals.morePatients.description',
  },
  {
    id: 'flexibleSchedule',
    screen: 'dashboard',
    icon: DoorOpen,
    titleKey: 'home.showcase.professionals.flexibleSchedule.title',
    descKey: 'home.showcase.professionals.flexibleSchedule.description',
  },
  {
    id: 'managementTools',
    screen: 'dashboard',
    icon: ClipboardList,
    titleKey: 'home.showcase.professionals.managementTools.title',
    descKey: 'home.showcase.professionals.managementTools.description',
  },
  {
    id: 'dedicatedSupport',
    screen: 'dashboard',
    icon: Stethoscope,
    titleKey: 'home.showcase.professionals.dedicatedSupport.title',
    descKey: 'home.showcase.professionals.dedicatedSupport.description',
  },
];

/** Small highlights used inside the professionals segment of the showcase. */
export const professionalPills: { icon: LucideIcon; key: string }[] = [
  { icon: UserPlus, key: 'home.showcase.professionals.pillOnboard' },
  { icon: HeartPulse, key: 'home.showcase.professionals.pillVerified' },
  { icon: CalendarDays, key: 'home.showcase.professionals.pillSchedule' },
];