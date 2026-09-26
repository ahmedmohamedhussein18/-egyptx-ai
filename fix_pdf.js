const fs = require('fs');

let c = fs.readFileSync('src/components/GovernmentDashboardContent.tsx', 'utf8');

c = c.replace(/const exportPDF = async \(\) => \{[\s\S]*?\}\s*};\n\n  const exportExcel/, `const exportPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const element = document.getElementById('dashboard-content');
      if (!element) return;
      setExportingPDF(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#050d1a'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(\`cairo-tourism-report-\${new Date().toISOString().split('T')[0]}.pdf\`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('حدث خطأ أثناء تصدير PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setExportingPDF(false);
    }
  };

  const exportExcel`);

c = c.replace(/<div ref=\{dashboardRef\} className="flex-1 overflow-y-auto/, '<div id="dashboard-content" ref={dashboardRef} className="flex-1 overflow-y-auto');

fs.writeFileSync('src/components/GovernmentDashboardContent.tsx', c);
console.log('Fixed exportPDF in GovernmentDashboardContent.tsx');
