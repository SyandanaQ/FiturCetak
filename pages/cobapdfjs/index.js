import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { Dialog } from 'primereact/dialog';
import data from './data.json';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import PDFViewer from './PDFViewer.js';

export default function Index() {
    const breadcrumbHome = { icon: 'pi pi-home', url: '/' };
    const breadcrumbItems = [{ label: 'Cetak' }];

    const [tableData, setTableData] = useState(data);
    const [selectedData, setSelectedData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

    const [marginTop, setMarginTop] = useState(''); // Pengaturan margin atas
    const [marginLeft, setMarginLeft] = useState(''); // Pengaturan margin kiri
    const [tableWidth, setTableWidth] = useState(''); // Lebar tabel

    const [pdfUrl, setPdfUrl] = useState(''); // URL PDF untuk ditampilkan di dialog

    useEffect(() => {
        if (selectAll) {
            setSelectedData(tableData);
        } else {
            setSelectedData([]);
        }
    }, [selectAll, tableData]);

    const handleCheckboxChange = (event, rowData) => {
        if (event.target.checked) {
            setSelectedData((prevSelectedData) => [...prevSelectedData, rowData]);
        } else {
            setSelectedData((prevSelectedData) => prevSelectedData.filter((item) => item !== rowData));
        }
    };

    const handleSelectAllClick = () => {
        setSelectAll(!selectAll);
    };

    const toast = useRef(null);
    const dt = useRef(null);

    const [orientation, setOrientation] = useState('portrait'); // Orientasi halaman PDF (portrait atau landscape)
    const [selectedPaperSize, setSelectedPaperSize] = useState('A4'); // Ukuran kertas PDF

    const paperSizes = [
        { name: 'A4', value: 'A4' },
        { name: 'Letter', value: 'Letter' },
        { name: 'Legal', value: 'Legal' }
    ];

    const orientationOptions = [
        { label: 'Potret', value: 'portrait' },
        { label: 'Lanskap', value: 'landscape' }
    ];

    const handlePaperSizeChange = (event) => {
        setSelectedPaperSize(event.target.value);
    };

    const handleOrientationChange = (event) => {
        setOrientation(event.target.value);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <form id="marginForm" style={{ margin: '20px' }}>
                        <div className="p-grid p-fluid">
                            <div className="p-col-12 p-md-4">
                                <div className="p-field">
                                    <label htmlFor="marginTop" className="p-d-block">
                                        Margin Atas:
                                    </label>
                                    <div className="p-inputgroup">
                                        <InputText id="marginTop" value={marginTop} onChange={(e) => setMarginTop(e.target.value)} type="number" min="0" step="0.1" />
                                        <span className="p-inputgroup-addon">mm</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-4">
                                <div className="p-field">
                                    <label htmlFor="marginLeft" className="p-d-block">
                                        Margin Kiri:
                                    </label>
                                    <div className="p-inputgroup">
                                        <InputText id="marginLeft" value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} type="number" min="0" step="0.1" />
                                        <span className="p-inputgroup-addon">mm</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-4">
                                <div className="p-field">
                                    <label htmlFor="tableWidth" className="p-d-block">
                                        Lebar Tabel:
                                    </label>
                                    <div className="p-inputgroup">
                                        <InputText id="tableWidth" value={tableWidth} onChange={(e) => setTableWidth(e.target.value)} type="number" min="0" step="0.1" />
                                        <span className="p-inputgroup-addon">mm</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-4">
                                <div className="p-field">
                                    <label htmlFor="paperSize" className="p-d-block">
                                        Pilih Ukuran Kertas:
                                    </label>
                                    <Dropdown id="paperSize" value={selectedPaperSize} options={paperSizes} onChange={handlePaperSizeChange} optionLabel="name" />
                                </div>
                            </div>

                            <div className="p-col-12 p-md-4">
                                <div className="p-field">
                                    <label htmlFor="orientation" className="p-d-block">
                                        Pilih Orientasi:
                                    </label>
                                    <Dropdown id="orientation" value={orientation} options={orientationOptions} onChange={handleOrientationChange} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-between align-items-center mt-2">
                    <Button label="Cetak Data Terpilih" icon="pi pi-print" className="p-button-success" onClick={handlePreview} style={{ marginRight: '10px' }} />
                </div>
            </React.Fragment>
        );
    };

    const handlePreview = () => {
        if (selectedData.length > 0) {
            if (marginLeft === '' || marginTop === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Mohon isi semua inputan margin terlebih dahulu.'
                });
                return;
            }

            let format = 'a4'; // Format default (A4)
            if (selectedPaperSize === 'Letter') {
                format = 'letter';
            } else if (selectedPaperSize === 'Legal') {
                format = 'legal';
            }

            const doc = new jsPDF({
                orientation,
                unit: 'mm',
                format,
                putOnlyUsedFonts: true
            });

            const marginLeftInMm = parseFloat(marginLeft);
            const marginTopInMm = parseFloat(marginTop);
            const tableWidthInMm = parseFloat(tableWidth);

            doc.setProperties({
                marginLeft: marginLeftInMm,
                marginRight: 0,
                marginTop: marginTopInMm,
                landscape: orientation === 'landscape'
            });

            const tableData = selectedData.map((rowData) => [rowData.NoTransaksi, rowData.Tgl, rowData.Kode, rowData.Debet, rowData.Kredit, rowData.Saldo, rowData.Keterangan]);

            doc.autoTable({
                body: tableData,
                startY: undefined,
                theme: 'grid',
                margin: { top: marginTopInMm, left: marginLeftInMm },
                tableWidth: tableWidthInMm,
                styles: { lineWidth: 0 }
            });

            const pdfDataUrl = doc.output('datauristring');

            // Atur pdfUrl sesuai dengan data yang dibuat
            setPdfUrl(pdfDataUrl);
            setPdfPreviewOpen(true); // Buka dialog setelah pdfUrl diatur
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Info',
                text: 'Pilih setidaknya satu data untuk dicetak.'
            });
        }
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} style={{ background: 'none', border: 'none' }} />
                <div className="card">
                    <h4>Cetak PDF</h4>
                    <hr />
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        id="dataTable"
                        ref={dt}
                        value={tableData}
                        paginator
                        rows={10}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} - {last} dari {totalRecords} data"
                        emptyMessage="Data Kosong"
                    >
                        <Column
                            field="select"
                            header={<input type="checkbox" checked={selectAll} onChange={handleSelectAllClick} />}
                            body={(rowData) => <input type="checkbox" checked={selectedData.includes(rowData)} onChange={(e) => handleCheckboxChange(e, rowData)} />}
                        />
                        <Column field="NoTransaksi" header="No Transaksi" sortable></Column>
                        <Column field="Tgl" header="Tanggal" sortable></Column>
                        <Column field="Kode" header="Kode" sortable></Column>
                        <Column field="Debet" header="Debet" sortable></Column>
                        <Column field="Kredit" header="Kredit" sortable></Column>
                        <Column field="Saldo" header="Saldo" sortable></Column>
                        <Column field="Keterangan" header="Keterangan" sortable></Column>
                    </DataTable>
                </div>
            </div>
            <Dialog visible={pdfPreviewOpen} onHide={() => setPdfPreviewOpen(false)} modal style={{ width: '57vw', minHeight: '80vh' }}>
                <div className="p-dialog-content">
                    <a href={pdfUrl} download="preview.pdf" className={`p-button-success ${!pdfUrl && 'p-md-display-none'}`}>
                        <Button label="Unduh PDF" icon="pi pi-download" />
                    </a>
                    <PDFViewer pdfUrl={pdfUrl} />
                </div>
            </Dialog>
        </div>
    );
}
