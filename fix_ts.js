const fs = require('fs');
let content = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

// 1. Fix TripAssistant 'e' type
content = content.replace(/const sendMsg = \(e\) =>/g, 'const sendMsg = (e: React.FormEvent) =>');

// 2. Fix destinations type
content = content.replace(/const \[destinations, setDestinations\] = useState\(\[\]\);/, 'const [destinations, setDestinations] = useState<string[]>([]);');

// 3. Fix Date math
content = content.replace(/new Date\(e\.target\.value\) - new Date\(startDate\)/, 'new Date(e.target.value).getTime() - new Date(startDate).getTime()');

// 4. Fix LoadingAnimation usage for regenerating day
content = content.replace(/<LoadingAnimation isRegenerating=\{true\} \/>/, '<CinematicLoading />');

// 5. Restore Parental Verification & handleTravelStyleChange if missing
if (!content.includes('const handleTravelStyleChange')) {
  const handler = `
  const handleTravelStyleChange = (id: string) => {
    if (id === 'family') {
      const verified = sessionStorage.getItem('isParentVerified');
      if (!verified) {
        setShowParentModal(true);
        return;
      }
    }
    setTravelStyle(id);
  };
  const handleVerifyParent = () => {
    if (!parentEmail || !/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(parentEmail)) {
      setParentError('Invalid email address');
      return;
    }
    if (!parentId || !/^\\d{14}$/.test(parentId)) {
      setParentError('National ID must be exactly 14 digits (الرقم القومي)');
      return;
    }
    sessionStorage.setItem('isParentVerified', 'true');
    setShowParentModal(false);
    setTravelStyle('family');
    setParentError('');
  };
  `;
  content = content.replace(/const getPayload = \(\) => \(\{/, handler + '\\n  const getPayload = () => ({');
}

// Ensure parental state exists
if (!content.includes('showParentModal')) {
  const parentalState = `
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentEmail, setParentEmail] = useState('');
  const [parentId, setParentId] = useState('');
  const [parentError, setParentError] = useState('');
  `;
  content = content.replace(/const \[destinations, setDestinations\] = useState<string\[\]>\(\[\]\);/, 'const [destinations, setDestinations] = useState<string[]>([]);' + parentalState);
}

// Add the Parental Modal to the DOM if missing
if (!content.includes('Parental Verification')) {
  const modalUI = `
      {showParentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A1628] border border-[#C9A84C]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Parental Verification</h3>
            <p className="text-sm text-white/60 mb-6">Kids/Family mode requires adult verification.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/80 mb-1">Parent's Email</label>
                <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">Egyptian National ID</label>
                <input type="text" maxLength={14} value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full bg-[#060E1A] border border-white/10 rounded-lg px-4 py-2 text-white" />
              </div>
              {parentError && <p className="text-red-400 text-sm">{parentError}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowParentModal(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5">Cancel</button>
                <button onClick={handleVerifyParent} className="flex-1 py-2 rounded-lg bg-[#C9A84C] text-[#030712] font-bold hover:bg-[#E2CB85]">Verify & Proceed</button>
              </div>
            </div>
          </div>
        </div>
      )}
  `;
  content = content.replace(/<div className="min-h-screen bg-\[#030712\] text-white">/, '<div className="min-h-screen bg-[#030712] text-white">\\n' + modalUI);
}

fs.writeFileSync('src/components/PlannerContent.tsx', content, 'utf8');
console.log('Fixed types and state.');
