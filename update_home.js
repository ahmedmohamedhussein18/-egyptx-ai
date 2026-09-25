const fs = require('fs');

const path = 'src/app/page.tsx';
let text = fs.readFileSync(path, 'utf8');

const returnStatementOld = `  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <FourPillarsSection />
      <SmartMobilitySection />
      <SmartTourismSection />
      <DestinationsSection />
      <EcosystemSection />
      <FutureEcosystemSection />
      <CTASection />
      <Footer />
    </main>
  );`;

const returnStatementNew = `  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <FourPillarsSection />
      <SmartTourismSection />
      <DestinationsSection />
      <EcosystemSection />
      <FutureEcosystemSection />
      <CTASection />
      <SmartMobilitySection />
      <Footer />
    </main>
  );`;

text = text.replace(returnStatementOld, returnStatementNew);
fs.writeFileSync(path, text, 'utf8');
console.log('Fixed Smart Mobility section position');
