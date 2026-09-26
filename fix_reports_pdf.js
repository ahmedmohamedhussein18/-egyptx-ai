const fs = require('fs');

let c = fs.readFileSync('src/components/government/ReportsContent.tsx', 'utf8');

c = c.replace(/const handleExportPDF = async \(\) => \{[\s\S]*?\}\s*};\n\n  return \(/, `const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExportingPDF(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(reportRef.current, { scale: 1, useCORS: true, allowTaint: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(\`EgyptX_Report_\${governorate}_\${dateRange}.pdf\`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('حدث خطأ أثناء تصدير PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setExportingPDF(false);
    }
  };

  return (`);

fs.writeFileSync('src/components/government/ReportsContent.tsx', c);
console.log('Fixed exportPDF in ReportsContent.tsx');
