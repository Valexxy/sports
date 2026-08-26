'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Gift, ShieldCheck, Check, CheckCheck, Sparkles, Lock, ShieldAlert } from 'lucide-react';
import { adminChat, ChatConversation, ChatMessage } from '../lib/admin-chat-engine';
import { auraVault } from '../lib/aura-vault-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { warriAudio } from '../lib/warri-commentary-engine';
import confetti from 'canvas-confetti';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose }) => {
  const currentUsername = typeof window !== 'undefined' ? (localStorage.getItem('aurascore_user_name') || 'james') : 'james';
  const [conv, setConv] = useState<ChatConversation>(adminChat.getConversationForUser(currentUsername));
  const [replyText, setReplyText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConv(adminChat.getConversationForUser(currentUsername));
    }
  }, [isOpen, currentUsername]);

  if (!isOpen) return null;

  const handleSendReply = () => {
    const text = replyText.trim();
    if (!text) return;

    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playAddPickSound();

    adminChat.sendMessage(conv.userId, 'USER', text);
    setConv({ ...adminChat.getConversationForUser(currentUsername) });
    setReplyText('');
  };

  const handleClaimAuraGift = (msgId: string, giftAmt: number) => {
    const claimed = adminChat.claimGift(conv.userId, msgId);
    if (claimed > 0) {
      const prof = auraVault.getProfile();
      prof.auraBalance += claimed;
      auraVault.saveProfile(prof);

      phoneHardware.triggerHaptic('SUCCESS');
      stadiumAudio.playCoinCashout();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

      setToastMsg('🎉 +' + claimed + ' AURA GIFT CLAIMED DIRECTLY INTO YOUR VAULT!');
      setConv({ ...adminChat.getConversationForUser(currentUsername) });
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-mono text-white">
      <div className="glass-panel-premium w-full sm:max-w-lg max-h-[88vh] rounded-t-3xl sm:rounded-3xl border-2 border-cyan-400 p-5 space-y-3 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-400 text-black font-black">
              🛡️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-sm text-white">MIVAJ OFFICIAL PAM ADMIN CHAT</h3>
                <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-400/50 text-cyan-300 text-[8px] font-bold flex items-center space-x-0.5">
                  <Lock className="w-2.5 h-2.5 inline" />
                  <span>AES-256 E2EE</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans">
                100% Encrypted &bull; Direct PAM Executive Support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Trust Banner */}
        <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[9px] text-gray-400 flex items-center justify-between flex-shrink-0">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-stadiumGreen" />
            <span>End-to-End Encrypted Session</span>
          </span>
          <span className="text-gray-500 font-mono">TLS 1.3 Certified</span>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen text-[11px] font-black animate-fadeIn flex items-center space-x-1.5 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[42vh]">
          {conv.messages.map((msg) => {
            const isAdmin = msg.senderRole === 'ADMIN';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} space-y-1`}
              >
                <div className="flex items-center space-x-1.5 text-[9px] text-gray-400 px-1 font-bold">
                  <span>{msg.senderName}</span>
                  <span>&bull;</span>
                  <span>{msg.timestamp}</span>
                  {!isAdmin && (
                    <span className="text-cyan-400">
                      {msg.deliveryStatus === 'READ' ? <CheckCheck className="w-3 h-3 inline" /> : <Check className="w-3 h-3 inline" />}
                    </span>
                  )}
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-sans space-y-2 ${
                    isAdmin
                      ? msg.isUrgentAlert
                        ? 'bg-gradient-to-br from-amber-950/80 via-black to-gold/20 border-2 border-gold text-white shadow-xl'
                        : 'bg-gradient-to-br from-slate-900 to-black border border-cyan-400/40 text-gray-100 shadow-md'
                      : 'bg-stadiumGreen text-black font-bold shadow'
                  }`}
                >
                  {isAdmin && msg.isUrgentAlert && (
                    <div className="flex items-center space-x-1 text-gold font-mono text-[9px] font-black pb-1 border-b border-gold/30">
                      <ShieldAlert className="w-3 h-3" />
                      <span>🚨 OFFICIAL VIP PAM PRIORITY ALERT</span>
                    </div>
                  )}

                  <p className="leading-relaxed">{msg.text}</p>

                  {/* Attached Gift Claim Box */}
                  {msg.attachedAuraGift && (
                    <div className="p-2.5 rounded-xl bg-black/80 border border-gold/50 flex items-center justify-between gap-2 mt-2 font-mono">
                      <div>
                        <span className="text-[9px] text-gold font-bold block">ADMIN AURA GIFT</span>
                        <span className="text-xs font-black text-white">+{msg.attachedAuraGift} AURA</span>
                      </div>

                      {!msg.isGiftClaimed ? (
                        <button
                          onClick={() => handleClaimAuraGift(msg.id, msg.attachedAuraGift!)}
                          className="px-3 py-1 rounded-lg bg-gradient-to-r from-gold to-amber-500 text-black font-black text-[10px] shadow active:scale-95 transition-all flex items-center space-x-1"
                        >
                          <Gift className="w-3 h-3" />
                          <span>Claim Gift ➔</span>
                        </button>
                      ) : (
                        <span className="text-[9px] text-stadiumGreen font-black">CLAIMED ✓</span>
                      )}
                    </div>
                  )}

                  <div className="text-[8px] text-gray-500 font-mono pt-1">
                    {msg.auditFingerprint}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Input Box */}
        <div className="pt-2 border-t border-white/10 flex gap-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Type encrypted message to Admin..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-gray-500 font-mono text-xs focus:border-cyan-400 focus:outline-none"
          />

          <button
            onClick={handleSendReply}
            className="px-4 py-2.5 rounded-2xl bg-cyan-400 text-black font-black text-xs flex items-center space-x-1 shadow active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

      </div>
    </div>
  );
};
