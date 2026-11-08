// Markdown (#, ##, ###, -, 1., **bold**, *italic*, ---) -> docx. Usage: node build_docx.js in.md out.docx
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, LevelFormat, convertInchesToTwip } = require('docx');
const ACCENT = '7A5C61', DARK = '2B2B2B';
function parseInline(line) {
  const runs = []; let rest = line; const re = /(\*\*(.+?)\*\*|\*(.+?)\*)/;
  while (rest.length) {
    const m = rest.match(re);
    if (!m) { runs.push(new TextRun({ text: rest, color: DARK })); break; }
    if (m.index > 0) runs.push(new TextRun({ text: rest.slice(0, m.index), color: DARK }));
    if (m[2] !== undefined) runs.push(new TextRun({ text: m[2], bold: true, color: DARK }));
    else runs.push(new TextRun({ text: m[3], italics: true, color: '6E5F61' }));
    rest = rest.slice(m.index + m[0].length);
  }
  return runs;
}
function buildParagraphs(md) {
  const out = []; let listCounter = 0;
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd(); if (!line.trim()) continue;
    if (line.startsWith('# ')) { out.push(new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1, spacing: { after: 240 } })); continue; }
    if (line === '---') { out.push(new Paragraph({ text: '', border: { bottom: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 4 } }, spacing: { before: 200, after: 200 } })); continue; }
    if (line.startsWith('### ')) { out.push(new Paragraph({ children: [new TextRun({ text: line.slice(4), bold: true, italics: true, color: DARK, size: 26 })], spacing: { before: 260, after: 120 }, keepNext: true })); continue; }
    if (line.startsWith('## ')) { out.push(new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2, spacing: { before: 340, after: 160 }, border: { bottom: { color: ACCENT, space: 4, style: BorderStyle.SINGLE, size: 6 } } })); continue; }
    if (line.startsWith('- ')) { out.push(new Paragraph({ children: [new TextRun('•  '), ...parseInline(line.slice(2))], indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) }, spacing: { after: 100 } })); continue; }
    const n = line.match(/^(\d+)\.\s+(.*)$/);
    if (n) { if (n[1] === '1') listCounter++; out.push(new Paragraph({ children: parseInline(n[2]), numbering: { reference: 'num', level: 0, instance: listCounter }, spacing: { after: 120 } })); continue; }
    out.push(new Paragraph({ children: parseInline(line), spacing: { after: 200, line: 300 } }));
  }
  return out;
}
const [src, dst] = process.argv.slice(2);
const doc = new Document({
  numbering: { config: [{ reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.START, style: { paragraph: { indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.25) } } } }] }] },
  styles: { default: { document: { run: { font: 'Georgia', size: 24, color: DARK } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { size: 40, bold: true, color: ACCENT, font: 'Georgia' } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { size: 30, bold: true, color: ACCENT, font: 'Georgia' }, paragraph: { keepNext: true } }] },
  sections: [{ properties: { page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.1), right: convertInchesToTwip(1.1) } } }, children: buildParagraphs(fs.readFileSync(src, 'utf8')) }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(dst, b); console.log('written', dst); });
