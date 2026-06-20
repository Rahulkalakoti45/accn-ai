import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  CheckCircle2, 
  Printer, 
  Search, 
  Award, 
  QrCode, 
  X,
  Sparkles,
  Link
} from 'lucide-react';
import { useStore, Activity } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';

export const Certificates: React.FC = () => {
  const theme = useTheme();
  const { addToast } = useToastStore();
  const { transactionHistory, user } = useStore();
  
  const [selectedCert, setSelectedCert] = useState<Activity | null>(null);
  const [verifyingChain, setVerifyingChain] = useState(false);

  // Extract mint transactions to generate certificates
  const certificates = transactionHistory.filter((tx) => tx.type === 'mint');

  const downloadCertificateAsPDF = (cert: Activity) => {
    const hashId = `ACCN-2024-${cert.id.substring(3, 8).toUpperCase()}`;
    const amountStr = cert.amount || '0';
    const amountVal = amountStr.includes(' ') ? amountStr.split(' ')[0] : amountStr;
    const co2Offset = Math.round(parseFloat(amountVal) * 3.7) || 0;

    // Create a hidden iframe to print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.write(`
      <html>
        <head>
          <title>${hashId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');
            body {
              font-family: 'DM Sans', sans-serif;
              background-color: #080C14;
              color: #F0F4FF;
              margin: 0;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              box-sizing: border-box;
            }
            .certificate-border {
              border: 4px double #7B4FFF;
              padding: 40px;
              width: 100%;
              max-width: 650px;
              height: 450px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background-color: #1A2235;
              border-radius: 16px;
              box-shadow: 0 0 30px rgba(123, 79, 255, 0.15);
              position: relative;
              box-sizing: border-box;
            }
            .corner-t-l { position: absolute; top: 12px; left: 12px; width: 15px; height: 15px; border-top: 2px solid #7B4FFF; border-left: 2px solid #7B4FFF; }
            .corner-t-r { position: absolute; top: 12px; right: 12px; width: 15px; height: 15px; border-top: 2px solid #7B4FFF; border-right: 2px solid #7B4FFF; }
            .corner-b-l { position: absolute; bottom: 12px; left: 12px; width: 15px; height: 15px; border-bottom: 2px solid #7B4FFF; border-left: 2px solid #7B4FFF; }
            .corner-b-r { position: absolute; bottom: 12px; right: 12px; width: 15px; height: 15px; border-bottom: 2px solid #7B4FFF; border-right: 2px solid #7B4FFF; }
            
            .header { text-align: center; }
            .header span { font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #7B4FFF; letter-spacing: 4px; font-weight: bold; text-transform: uppercase; }
            .header h3 { font-size: 14px; font-family: 'JetBrains Mono', monospace; color: #ffffff; letter-spacing: 2px; margin: 8px 0 0 0; }
            
            .content { text-align: center; margin: 25px 0; }
            .content .amount { font-size: 40px; font-weight: bold; font-family: 'JetBrains Mono', monospace; color: #00E5A0; margin: 0; }
            .content .label { font-size: 10px; color: #a0aec0; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px; }
            .content .desc { font-size: 12px; color: #e2e8f0; margin-top: 15px; line-height: 1.6; }
            
            .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; }
            .footer-left { display: flex; align-items: center; gap: 15px; }
            .footer-right { text-align: right; font-family: 'JetBrains Mono', monospace; }
            .footer-right .signed { font-size: 10px; color: #00E5A0; font-weight: bold; }
            .footer-right .hash { font-size: 8px; color: #718096; margin-top: 3px; }
            
            .qr-placeholder {
              width: 50px;
              height: 50px;
              background-color: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ffffff;
              font-size: 8px;
              font-family: 'JetBrains Mono', monospace;
            }
            
            @media print {
              body { background: #ffffff !important; color: #000000 !important; padding: 0; }
              .certificate-border { background: #ffffff !important; border-color: #000000 !important; box-shadow: none !important; color: #000000 !important; }
              .header h3, .content .amount, .footer-right .signed { color: #000000 !important; }
              .header span, .corner-t-l, .corner-t-r, .corner-b-l, .corner-b-r { border-color: #000000 !important; color: #000000 !important; }
              .content .desc, .content .label { color: #333333 !important; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-border">
            <div class="corner-t-l"></div>
            <div class="corner-t-r"></div>
            <div class="corner-b-l"></div>
            <div class="corner-b-r"></div>
            
            <div class="header">
              <span>Carbon Offset Asset</span>
              <h3>${hashId}</h3>
            </div>
            
            <div class="content">
              <div class="amount">${amountVal} CARBON CREDITS</div>
              <div class="label">Equivalent to ${co2Offset} kg CO₂ offset</div>
              <div class="desc">
                This document certifies that <strong>${amountVal} Carbon Credits</strong> have been successfully 
                minted on the AI Carbon Credit Network (ACCN) Registry. Verified via Smart Grid 
                telemetry sync by owner <strong>${user.name}</strong>.
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-left">
                <div class="qr-placeholder">ACCN QR</div>
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #718096; text-align: left;">
                  MINT HASH: 0x8a92f...724521<br>
                  VALIDITY: DEC 2026 REG REVIEW
                </div>
              </div>
              <div class="footer-right">
                <div class="signed">✓ Signed by ARIA AI</div>
                <div class="hash">SHA256: 3a921d...45bd8821</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  const handleAction = (action: string, cert?: Activity) => {
    if (action === 'Download' && cert) {
      addToast('info', 'Document Hub', `Generating cryptographic certificate PDF...`);
      downloadCertificateAsPDF(cert);
    } else {
      addToast('info', 'Document Hub', `Executing command: ${action}...`);
    }
  };

  const handleVerifyOnChain = (certId: string) => {
    setVerifyingChain(true);
    addToast('info', 'Blockchain Sync', `Querying ACCN registry for certificate index hash...`);
    
    setTimeout(() => {
      setVerifyingChain(false);
      addToast('success', 'Signature Match', `Block verified: 0x8a92...e421 holds certificate parameters.`);
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-cardBorder pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">Certificates Gallery</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Audit-ready ESG proof documentation, signed cryptographically.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const hashId = `ACCN-2024-${cert.id.substring(3, 8).toUpperCase()}`;
            return (
              <motion.div
                key={cert.id}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedCert(cert)}
                className="p-6 rounded-2xl border border-accentGold/20 bg-cardSurface/30 hover:border-accentGold hover:shadow-neon-gold/20 hover:shadow-lg transition-all cursor-pointer relative flex flex-col justify-between h-72 glass-panel"
              >
                {/* Decorative border ornaments */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-accentGold/40" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-accentGold/40" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-accentGold/40" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-accentGold/40" />

                <div className="flex flex-col gap-1 text-center items-center mt-4">
                  <span className="text-[9px] font-mono text-accentGold uppercase tracking-widest font-bold">
                    Carbon Offset Asset
                  </span>
                  <h3 className="text-xs font-mono text-white tracking-widest uppercase font-bold mt-1">
                    {hashId}
                  </h3>
                </div>

                <div className="my-6 text-center flex flex-col gap-1">
                  <span className="text-3xl font-bold font-mono text-white tracking-tight">
                    {cert.amount?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-textSecondary font-mono uppercase tracking-widest">
                    Verified Carbon Credits
                  </span>
                  <span className="text-[9px] text-accentGreen font-bold font-mono mt-1">
                    &bull; Dynamic Trust: {user.trustScore}%
                  </span>
                </div>

                <div className="border-t border-cardBorder/40 pt-4 flex justify-between items-center text-[10px] font-mono text-textSecondary">
                  <div>
                    <span className="text-textMuted uppercase block select-none">Holder</span>
                    <span className="text-textPrimary font-bold uppercase">{user.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-textMuted uppercase block select-none">Issued</span>
                    <span className="text-textPrimary font-bold">{cert.timestamp.split(',')[0]}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-cardBorder bg-cardSurface/20">
          <FileText className="w-10 h-10 text-textMuted mx-auto mb-2 opacity-50" />
          <p className="text-sm text-textSecondary font-semibold">No carbon certificates generated yet</p>
          <p className="text-xs text-textMuted mt-1">Go to Dashboard and upload utility bills to mint credits.</p>
        </div>
      )}

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-[640px] rounded-3xl border border-accentGold/30 bg-bgMidnight p-6 relative z-10 glass-panel flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute right-5 top-5 p-1 rounded-lg hover:bg-white/5 text-textSecondary hover:text-textPrimary"
              >
                <X className="w-5 h-5" />
              </button>

              {/* The Certificate portrait box */}
              <div 
                className="w-full bg-[#070b14] rounded-2xl border-2 border-accentGold/40 p-8 flex flex-col justify-between relative overflow-hidden text-center text-textPrimary shadow-2xl min-h-[500px]"
                id="printable-cert"
              >
                {/* Watermark Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] opacity-[0.02] pointer-events-none select-none font-bold font-heading">
                  ACCN
                </div>

                {/* Classic Corner Ornaments */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accentGold/60" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accentGold/60" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accentGold/60" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accentGold/60" />

                <div className="flex flex-col items-center gap-1.5 mt-4">
                  <span className="text-xs font-bold tracking-widest text-accentGold uppercase font-mono">
                    AI Carbon Credit Network
                  </span>
                  <div className="h-px w-20 bg-accentGold/40 my-1" />
                  <h2 className="text-xl font-bold font-heading uppercase text-gradient-purple-cyan tracking-wide">
                    CARBON CREDIT CERTIFICATE
                  </h2>
                </div>

                <div className="my-8 flex flex-col gap-4">
                  <p className="text-xs text-textSecondary italic">This documents and certifies that</p>
                  <h3 className="text-xl font-bold font-heading text-white tracking-wide uppercase">
                    {user.name}
                  </h3>
                  <p className="text-xs text-textSecondary max-w-md mx-auto leading-relaxed">
                    has successfully generated and holds total verified ownership of
                  </p>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold font-mono text-accentGreen tracking-tight">
                      {selectedCert.amount?.split(' ')[0]} CARBON CREDITS
                    </span>
                    <span className="text-[10px] text-textMuted font-mono mt-1 uppercase">
                      Equivalent to {Math.round(parseFloat(selectedCert.amount || '0') * 3.7)} kg CO₂ emissions offset
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-cardBorder/40 py-4 max-w-sm mx-auto text-left font-mono text-[10px] text-textSecondary">
                  <div>
                    <span className="text-textMuted uppercase block">Certificate ID:</span>
                    <span className="text-textPrimary font-bold">ACCN-{selectedCert.id.substring(3, 8).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-textMuted uppercase block">Trust Rating:</span>
                    <span className="text-accentGreen font-bold">{user.trustScore}% Verified</span>
                  </div>
                  <div>
                    <span className="text-textMuted uppercase block">Energy Vector:</span>
                    <span className="text-white">Solar Smart telemetry</span>
                  </div>
                  <div>
                    <span className="text-textMuted uppercase block">Issued date:</span>
                    <span className="text-white">{selectedCert.timestamp}</span>
                  </div>
                </div>

                {/* QR Code and digital signatures */}
                <div className="flex justify-between items-end border-t border-cardBorder/40 pt-4 mt-6">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-12 h-12 text-white border border-white/10 p-1 bg-white/5 rounded-lg" />
                    <div className="text-left font-mono text-[8px] text-textMuted">
                      <span>MINT HASH: 0x8a92f...724521</span> <br />
                      <span>VALIDITY: DEC 2026 UNTIL REG REVIEW</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col gap-0.5 select-none">
                    <span className="text-[9px] font-mono text-accentGreen font-bold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3 text-accentGreen" /> Signed by ARIA AI
                    </span>
                    <span className="text-[7px] font-mono text-textMuted max-w-[120px] truncate">
                      SHA256: 3a921d...45bd8821
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions row below */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleAction('Download', selectedCert)}
                  className="py-2.5 rounded-xl border border-cardBorder bg-cardSurface/40 hover:bg-cardSurface/80 text-[10px] font-bold text-white flex items-center justify-center gap-1 hover:border-white/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF Download
                </button>

                <button
                  onClick={() => addToast('success', 'Copied', 'Certificate link copied to clipboard.')}
                  className="py-2.5 rounded-xl border border-cardBorder bg-cardSurface/40 hover:bg-cardSurface/80 text-[10px] font-bold text-white flex items-center justify-center gap-1 hover:border-white/10"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Link
                </button>

                <button
                  onClick={() => handleVerifyOnChain(selectedCert.id)}
                  disabled={verifyingChain}
                  className="py-2.5 rounded-xl bg-accentGreen/15 border border-accentGreen/30 hover:bg-accentGreen hover:text-bgSpace text-[10px] font-bold text-accentGreen flex items-center justify-center gap-1 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {verifyingChain ? 'Verifying...' : 'Verify Chain'}
                </button>

                <button
                  onClick={() => window.print()}
                  className="py-2.5 rounded-xl border border-cardBorder bg-cardSurface/40 hover:bg-cardSurface/80 text-[10px] font-bold text-white flex items-center justify-center gap-1 hover:border-white/10"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Doc
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
