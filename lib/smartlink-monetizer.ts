'use client';

import { SMARTLINK_CONFIG, TOP_CPA_AFFILIATES } from '../config/monetization';
import { phoneHardware } from './phone-hardware-engine';

export const smartlinkMonetizer = {
  /**
   * Launch monetized smartlink / CPA offer in new tab
   */
  triggerSmartLink: (fallbackUrl?: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    const target = fallbackUrl || SMARTLINK_CONFIG.monetagDirectLink || TOP_CPA_AFFILIATES[0].affiliateUrl;
    window.open(target, '_blank', 'noopener,noreferrer');
  },

  /**
   * Trigger affiliate CPA registration with bonus tracking
   */
  triggerAffiliateRegistration: (affiliateId: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    const offer = TOP_CPA_AFFILIATES.find(a => a.id === affiliateId) || TOP_CPA_AFFILIATES[0];
    window.open(offer.affiliateUrl, '_blank', 'noopener,noreferrer');
  },

  /**
   * Unlock VIP slip after completing action
   */
  recordUnlockAction: (slipId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`unlocked_vip_${slipId}`, 'true');
    }
  },

  isSlipUnlocked: (slipId: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`unlocked_vip_${slipId}`) === 'true';
  }
};
