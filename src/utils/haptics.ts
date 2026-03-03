import * as Haptics from 'expo-haptics';
const safe = (fn: () => Promise<void>) => { fn().catch(() => {}); };
export const lightTap = () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
export const mediumTap = () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
export const heavyTap = () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
export const success = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const warning = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
export const error = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
export const selection = () => safe(() => Haptics.selectionAsync());
