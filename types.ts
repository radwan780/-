
export type LightingStyle = 'إضاءة طبيعية' | 'إضاءة استوديو' | 'الساعة الذهبية' | 'الساعة الزرقاء' | 'سينمائي' | 'درامي';
export type CameraPerspective = 'منظر أمامي' | 'منظر علوي' | 'منظر جانبي' | 'زاوية 45 درجة' | 'لقطة مقربة' | 'لقطة ماكرو';

export interface CustomizationOptions {
  lightingStyle: LightingStyle;
  cameraPerspective: CameraPerspective;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface User {
  name: string;
  email: string;
  isVerified: boolean;
}
