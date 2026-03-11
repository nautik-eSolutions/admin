import {date} from "quasar";

export function printCheckInOut(title, date, checinOuts){
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} - ${date}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-item .label {
          font-size: 12px;
          color: #666;
        }
        .stat-item .value {
          font-size: 24px;
          font-weight: bold;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #333;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr.completed {
          background-color: #e8f5e9;
        }
        .status {
          text-align: center;
          font-weight: bold;
        }
        .status.completed {
          color: #2e7d32;
        }
        .status.pending {
          color: #f57c00;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        @media print {
          body { padding: 10px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Listado de Check-In</h1>
        <p>Fecha: ${date}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 100px;">Hora</th>
            <th>Huésped</th>
            <th>Embarcación</th>
            <th style="width: 120px;">Amarre</th>
          </tr>
        </thead>
        <tbody>
          ${checinOuts.value.length === 0 ? `
            <tr>
              <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                No hay Check-ins programados
              </td>
            </tr>
          ` : checinOuts.value.map(checkout => `
            <tr">
              <td style="text-align: center; font-family: monospace;">
                ${checkout.scheduledTime.substring(11, 16)}
              </td>
              <td>${checkout.guestName}</td>
              <td>${checkout.boatName}</td>
              <td style="text-align: center; font-weight: bold;">
                ${checkout.mooringNumber}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        Generado el ${new Date()}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 250);
}
