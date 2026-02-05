import { LightingStyle, CameraPerspective } from './types';

export const LIGHTING_STYLES: { value: LightingStyle; label: string }[] = [
  { value: 'إضاءة طبيعية', label: 'إضاءة طبيعية' },
  { value: 'إضاءة استوديو', label: 'إضاءة استوديو' },
  { value: 'الساعة الذهبية', label: 'الساعة الذهبية' },
  { value: 'الساعة الزرقاء', label: 'الساعة الزرقاء' },
  { value: 'سينمائي', label: 'سينمائي' },
  { value: 'درامي', label: 'درامي' },
];

export const CAMERA_PERSPECTIVES: { value: CameraPerspective; label: string }[] = [
  { value: 'منظر أمامي', label: 'منظر أمامي' },
  { value: 'منظر علوي', label: 'منظر علوي' },
  { value: 'منظر جانبي', label: 'منظر جانبي' },
  { value: 'زاوية 45 درجة', label: 'زاوية 45 درجة' },
  { value: 'لقطة مقربة', label: 'لقطة مقربة' },
  { value: 'لقطة ماكرو', label: 'لقطة ماكرو' },
];