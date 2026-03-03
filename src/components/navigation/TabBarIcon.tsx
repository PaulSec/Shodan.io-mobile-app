import { type ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
type IoniconsName = ComponentProps<typeof Ionicons>['name'];
interface TabBarIconProps { name: IoniconsName; color: string; size?: number }
export function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) { return <Ionicons name={name} size={size} color={color} />; }
