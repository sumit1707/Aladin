import { jsPDF } from 'jspdf';
import { ItineraryDay } from './aiItinerary';

export function exportItineraryToPDF(
  destinationName: string,
  itinerary: ItineraryDay[],
  totalCost: number
) {
  console.log('exportItineraryToPDF called with:', { destinationName, itineraryLength: itinerary?.length, totalCost });

  if (!destinationName || !itinerary || !Array.isArray(itinerary)) {
    throw new Error('Invalid parameters: destinationName, itinerary, and totalCost are required');
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  console.log('PDF document initialized');

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${destinationName} Itinerary`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${itinerary.length} Days | Total Cost: ₹${totalCost.toLocaleString('en-IN')} per person`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  itinerary.forEach((day, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(16, 185, 129);
    doc.rect(margin, yPosition, contentWidth, 12, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`Day ${day.day}: ${day.title}`, margin + 5, yPosition + 8);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const costText = `Cost: ₹${day.estimated_cost_per_person.toLocaleString('en-IN')} | Transit: ${day.total_transit_hours} hours`;
    doc.text(costText, margin, yPosition + 5);
    yPosition += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Activities:', margin, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'normal');
    day.items.forEach((item) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      const activityText = `• ${item.time} - ${item.activity} (${item.duration})`;
      const activityLines = doc.splitTextToSize(activityText, contentWidth - 10);
      activityLines.forEach((line: string) => {
        doc.text(line, margin + 5, yPosition);
        yPosition += 5;
      });

      if (item.transit) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('  [Transit time]', margin + 10, yPosition);
        yPosition += 4;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
      }
      yPosition += 2;
    });

    yPosition += 8;
  });

  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Trip Cost: ₹${totalCost.toLocaleString('en-IN')} per person`, margin, yPosition);
  yPosition += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Note: All costs are approximate. Please verify with live sources for exact pricing.', margin, yPosition);

  const filename = `${destinationName.replace(/\s+/g, '_')}_Itinerary.pdf`;
  console.log('Saving PDF as:', filename);
  doc.save(filename);
  console.log('PDF saved successfully');
}
