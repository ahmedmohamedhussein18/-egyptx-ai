const fs = require('fs');

let c = fs.readFileSync('src/components/GovernmentDashboardContent.tsx', 'utf8');

c = c.replace(/const handleExportPDF = async \(\) => \{[\s\S]*?\}\s*};\n\n  const exportExcel/, `const handleExportPDF = async () => {
  try {
    setExportingPDF(true);
    const { default: jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add Arabic-compatible font or use latin characters
    const today = new Date().toLocaleDateString('en-GB');
    
    // Header
    pdf.setFillColor(5, 13, 26);
    pdf.rect(0, 0, 210, 297, 'F');
    
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(20);
    pdf.text('EgyptX AI - Cairo Tourism Report', 105, 20, { align: 'center' });
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text(\`Generated: \${today}\`, 105, 30, { align: 'center' });
    pdf.text('Governorate: Cairo', 105, 38, { align: 'center' });
    
    // Divider line
    pdf.setDrawColor(201, 168, 76);
    pdf.line(20, 45, 190, 45);
    
    // KPI Section
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(14);
    pdf.text('Key Performance Indicators', 20, 55);
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    
    const currentKpis = data?.kpis || {};
    const kpiItems = [
      { label: 'Attractions Views', value: String(currentKpis.attractionViews || 0) },
      { label: 'Platform Sessions', value: String(currentKpis.totalSessions || 0) },
      { label: 'Verified Visits', value: String(currentKpis.verifiedCheckins || 0) },
      { label: 'Trip Plans', value: String(currentKpis.tripPlansCreated || 0) },
      { label: 'Registered Users', value: String(currentKpis.registeredUsers || 0) },
    ];
    
    kpiItems.forEach((kpi, index) => {
      const y = 68 + (index * 12);
      pdf.setTextColor(180, 180, 180);
      pdf.text(kpi.label + ':', 25, y);
      pdf.setTextColor(201, 168, 76);
      pdf.text(kpi.value, 120, y);
    });
    
    // Attractions section
    pdf.setDrawColor(201, 168, 76);
    pdf.line(20, 135, 190, 135);
    
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(14);
    pdf.text('Cairo Heritage Attractions', 20, 145);
    
    // Table headers
    pdf.setFontSize(10);
    pdf.setTextColor(201, 168, 76);
    pdf.text('Attraction Name', 25, 158);
    pdf.text('Category', 110, 158);
    pdf.text('Check-ins', 160, 158);
    
    pdf.line(20, 161, 190, 161);
    
    const currentAttractions = data?.attractionsList || [];
    const charts = data?.charts || {};
    if (currentAttractions && currentAttractions.length > 0) {
      currentAttractions.slice(0, 15).forEach((attraction: any, index: number) => {
        const y = 168 + (index * 9);
        if (y > 280) return;
        pdf.setTextColor(255, 255, 255);
        pdf.text(attraction.name_en?.substring(0, 35) || 'Unknown', 25, y);
        pdf.setTextColor(180, 180, 180);
        pdf.text(attraction.category || 'General', 110, y);
        const checkins = charts?.topAttractionsTable?.find((t: any) => t.id === attraction.id)?.checkins || 0;
        pdf.text(String(checkins), 160, y);
      });
    }
    
    // Footer
    pdf.setDrawColor(201, 168, 76);
    pdf.line(20, 285, 190, 285);
    pdf.setTextColor(180, 180, 180);
    pdf.setFontSize(8);
    pdf.text('EgyptX AI - National Smart Tourism Ecosystem | Data Source: EgyptX First-Party Analytics', 105, 291, { align: 'center' });
    
    pdf.save(\`cairo-tourism-report-\${today.replace(/\\//g, '-')}.pdf\`);
    
  } catch (err) {
    console.error('PDF Error:', err);
    alert('PDF export failed. Please try again.');
  } finally {
    setExportingPDF(false);
  }
};

  const exportExcel`);

fs.writeFileSync('src/components/GovernmentDashboardContent.tsx', c);
console.log('Fixed exportPDF to data-driven jsPDF');
