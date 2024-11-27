import ExcelJS from 'exceljs';

export const generateXlsx = async (data: any[]) => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('My Sheet', { views: [{ showGridLines: true }] });
	worksheet.columns = Object.keys(data[0]).map((key) => ({
		header: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
		key,
		width: 30
	}));
	data.forEach(item => worksheet.addRow(item));
	worksheet.eachRow((row, rowNumber) => {
		row.eachCell((cell, colNumber) => {
			cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
			cell.border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			};

			if (rowNumber === 1) {
				cell.font = { bold: true };
			}

			cell.protection = { locked: false };
		});
	});
	const buffer = await workbook.xlsx.writeBuffer();
	return buffer;
}
