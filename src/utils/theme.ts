import { useStore } from '../store/useStore';

export interface ThemeColors {
  primary: string;
  hoverBg: string;
  border: string;
  glow: string;
  badge: string;
  text: string;
  gradient: string;
}

export const getThemeColors = (color: 'green' | 'cyan' | 'purple' | 'gold'): ThemeColors => {
  switch (color) {
    case 'cyan':
      return {
        primary: '#00D4FF',
        hoverBg: 'hover:bg-[#00D4FF]/10',
        border: 'border-[#00D4FF]/30',
        glow: 'shadow-[0_0_15px_rgba(0,212,255,0.25)]',
        badge: 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30',
        text: 'text-[#00D4FF]',
        gradient: 'from-[#00D4FF] to-[#7C3AED]',
      };
    case 'purple':
      return {
        primary: '#7C3AED',
        hoverBg: 'hover:bg-[#7C3AED]/10',
        border: 'border-[#7C3AED]/30',
        glow: 'shadow-[0_0_15px_rgba(124,58,237,0.25)]',
        badge: 'bg-[#7C3AED]/15 text-[#7C3AED] border-[#7C3AED]/30',
        text: 'text-[#7C3AED]',
        gradient: 'from-[#7C3AED] to-[#00D4FF]',
      };
    case 'gold':
      return {
        primary: '#F59E0B',
        hoverBg: 'hover:bg-[#F59E0B]/10',
        border: 'border-[#F59E0B]/30',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
        badge: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
        text: 'text-[#F59E0B]',
        gradient: 'from-[#F59E0B] to-[#EF4444]',
      };
    case 'green':
    default:
      return {
        primary: '#00FF88',
        hoverBg: 'hover:bg-[#00FF88]/10',
        border: 'border-[#00FF88]/30',
        glow: 'shadow-[0_0_15px_rgba(0,255,136,0.25)]',
        badge: 'bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/30',
        text: 'text-[#00FF88]',
        gradient: 'from-[#00FF88] to-[#00D4FF]',
      };
  }
};

export const useTheme = () => {
  const color = useStore((state) => state.themeColor);
  return getThemeColors(color);
};
