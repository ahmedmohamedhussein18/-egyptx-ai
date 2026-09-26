const fs = require('fs');

let c = fs.readFileSync('src/components/GovernmentDashboardContent.tsx', 'utf8');

c = c.replace(/const exportPDF = async \(\) => \{[\s\S]*?\}\s*};\n\n  const exportExcel/, `const handleExportPDF = async () => {
  try {
    setExportingPDF(true);
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    
    const dashboard = document.querySelector('main') || document.body;
    
    const canvas = await html2canvas(dashboard as HTMLElement, {
      scale: 0.8,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#050d1a',
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(\`cairo-dashboard-\${new Date().toLocaleDateString('ar-EG').replace(/\\//g, '-')}.pdf\`);
    
  } catch (err) {
    console.error('PDF Error:', err);
    alert('تعذر تصدير PDF. يرجى المحاولة مرة أخرى.');
  } finally {
    setExportingPDF(false);
  }
};

  const exportExcel`);

// Replace onClick
c = c.replace(/onClick=\{exportPDF\}/g, 'onClick={handleExportPDF}');

fs.writeFileSync('src/components/GovernmentDashboardContent.tsx', c);
console.log('Fixed exportPDF to handleExportPDF');
