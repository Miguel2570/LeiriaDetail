import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ClientData {
  name: string;
  email: string;
  phone: string;
}

interface HistoryItem {
  id: string;
  bookingDate: string;      // ← camelCase
  bookingTime: string;      // ← camelCase
  serviceName: string;      // ← camelCase
  servicePrice: number;     // ← camelCase
  vehicleName: string;      // ← camelCase
  vehiclePlate: string;     // ← camelCase
  status: string;
}

export function generateHistoryPDF(
  client: ClientData,
  history: HistoryItem[]
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // CABEÇALHO
  doc.setFillColor(5, 5, 8);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(0, 216, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('LeiriaDetail', 15, 18);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Histórico de Serviços', 15, 28);
  
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-PT')}`, pageWidth - 15, 18, { align: 'right' });

  // DADOS DO CLIENTE
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Cliente', 15, 55);
  
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${client.name}`, 15, 65);
  doc.text(`Email: ${client.email}`, 15, 72);
  doc.text(`Telefone: ${client.phone || 'Não informado'}`, 15, 79);

  // TABELA DE SERVIÇOS
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Histórico de Serviços', 15, 98);

  const tableData = history.map(item => [
    new Date(item.bookingDate).toLocaleDateString('pt-PT'),
    item.bookingTime,
    item.serviceName,
    item.vehiclePlate,
    `${item.servicePrice}€`,
  ]);

  autoTable(doc, {
    startY: 105,
    head: [['Data', 'Hora', 'Serviço', 'Matrícula', 'Preço']],
    body: tableData,
    headStyles: {
      fillColor: [5, 5, 8],
      textColor: [0, 216, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: [80, 80, 80],
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      cellPadding: 4,
    },
  });

  // TOTAL
  const total = history.reduce((sum, item) => sum + item.servicePrice, 0);
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: ${total}€`, pageWidth - 15, finalY, { align: 'right' });
  
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${history.length} serviço(s) realizado(s)`, pageWidth - 15, finalY + 8, { align: 'right' });

  // RODAPÉ
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(5, 5, 8);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.text('LeiriaDetail - O melhor para o seu carro', pageWidth / 2, pageHeight - 6, { align: 'center' });
  doc.text('www.leiriadetail.pt', pageWidth / 2, pageHeight - 3, { align: 'center' });

  // GUARDAR
  doc.save(`leiriadetail-historico-${client.name.toLowerCase().replace(/\s/g, '-')}.pdf`);
}