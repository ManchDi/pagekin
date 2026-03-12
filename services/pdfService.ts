import jsPDF from 'jspdf';
import { StoryPage, StoryConfig } from '../types';

const PAGE_W = 148; // A5 width in mm
const PAGE_H = 210; // A5 height in mm
const MARGIN = 12;
const PURPLE = [124, 58, 237] as const;   // purple-600
const GRAY = [75, 85, 99] as const;        // gray-600
const LIGHT = [243, 232, 255] as const;    // purple-100

// Load an image data URL and return dimensions-aware placement
async function drawImage(
  doc: jsPDF,
  dataUrl: string,
  x: number,
  y: number,
  maxW: number,
  maxH: number
): Promise<number> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxW / img.width, maxH / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const centeredX = x + (maxW - w) / 2;
      doc.addImage(dataUrl, 'PNG', centeredX, y, w, h);
      resolve(h);
    };
    img.onerror = () => resolve(0);
    img.src = dataUrl;
  });
}

function drawCoverPage(doc: jsPDF, config: StoryConfig) {
  const cx = PAGE_W / 2;

  // Background fill
  doc.setFillColor(...LIGHT);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  // Decorative top band
  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, PAGE_W, 18, 'F');

  // Stars in top band
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('✦  Pagekin  ✦', cx, 12, { align: 'center' });

  // Title
  doc.setTextColor(...PURPLE);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');

  const titleText = config.childName && config.includeChild
    ? `${config.childName}'s Story`
    : 'A Magical Story';

  doc.text(titleText, cx, 60, { align: 'center' });

  // Divider
  doc.setDrawColor(...PURPLE);
  doc.setLineWidth(0.5);
  doc.line(MARGIN + 20, 68, PAGE_W - MARGIN - 20, 68);

  // Theme
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...GRAY);
  const themeLines = doc.splitTextToSize(`"${config.theme}"`, PAGE_W - MARGIN * 2 - 10);
  doc.text(themeLines, cx, 80, { align: 'center' });

  // Age range
  const ageLabel: Record<string, string> = {
    '2-4': 'For little ones aged 2–4',
    '5-7': 'For readers aged 5–7',
    '8-10': 'For readers aged 8–10',
  };
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(ageLabel[config.ageRange] ?? '', cx, 100, { align: 'center' });

  // Big decorative sparkle
  doc.setFontSize(60);
  doc.setTextColor(...PURPLE);
  doc.text('✨', cx, 150, { align: 'center' });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.setFont('helvetica', 'normal');
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Created with Pagekin · ${date}`, cx, PAGE_H - 8, { align: 'center' });
}

async function drawStoryPage(
  doc: jsPDF,
  page: StoryPage,
  pageIndex: number,
  totalPages: number
) {
  const cx = PAGE_W / 2;
  const contentW = PAGE_W - MARGIN * 2;

  // Subtle background
  doc.setFillColor(252, 250, 255);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  // Image area
  const imageAreaY = MARGIN;
  const imageAreaH = PAGE_H * 0.52;

  if (page.imageUrl) {
    // Rounded rect placeholder/background for image
    doc.setFillColor(237, 233, 254); // purple-100
    doc.roundedRect(MARGIN, imageAreaY, contentW, imageAreaH, 4, 4, 'F');
    await drawImage(doc, page.imageUrl, MARGIN, imageAreaY, contentW, imageAreaH);
  } else {
    // No image placeholder
    doc.setFillColor(237, 233, 254);
    doc.roundedRect(MARGIN, imageAreaY, contentW, imageAreaH, 4, 4, 'F');
    doc.setTextColor(...PURPLE);
    doc.setFontSize(10);
    doc.text('Illustration', cx, imageAreaY + imageAreaH / 2, { align: 'center' });
  }

  // Story text
  const textY = imageAreaY + imageAreaH + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  const lines = doc.splitTextToSize(page.text, contentW);
  doc.text(lines, MARGIN, textY);

  // Page number
  doc.setFontSize(9);
  doc.setTextColor(167, 139, 250); // purple-400
  doc.text(`${pageIndex + 1} / ${totalPages}`, cx, PAGE_H - 6, { align: 'center' });
}

export async function generateStoryPDF(
  pages: StoryPage[],
  config: StoryConfig
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });

  // Cover page
  drawCoverPage(doc, config);

  // Story pages — only include fully generated ones
  const readyPages = pages.filter(p => p.text && !p.isGenerating);

  for (let i = 0; i < readyPages.length; i++) {
    doc.addPage();
    await drawStoryPage(doc, readyPages[i], i, readyPages.length);
  }

  // Save
  const filename = config.childName
    ? `${config.childName.toLowerCase().replace(/\s+/g, '-')}-story.pdf`
    : 'pagekin-story.pdf';

  doc.save(filename);
}