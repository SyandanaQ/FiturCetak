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
import axios from 'axios';

export default function index() {
    const breadcrumbHome = { icon: 'pi pi-home', url: '/' };
    const breadcrumbItems = [{ label: 'Cetak' }];

    const [tableData, setTableData] = useState(data);
    const [selectedData, setSelectedData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

    // Tambahkan ini untuk mengelola pengaturan margin dan lebar tabel
    const [marginTop, setMarginTop] = useState('');
    const [marginLeft, setMarginLeft] = useState('');
    const [tableWidth, setTableWidth] = useState('');
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {}
    });

    // Tambahkan ini untuk mengelola URL PDF
    const [pdfUrl, setPdfUrl] = useState(''); // State to store PDF URL

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
    const [loading] = useState(false);

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <form id="marginForm" style={{ margin: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="marginTop" className="form-label">
                                Margin Atas:
                            </label>
                            <div className="input-group">
                                <input type="number" className="form-control" id="marginTop" value={marginTop} onChange={(e) => setMarginTop(e.target.value)} min="0" step="0.1" />
                                <span className="input-group-text"> mm</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="marginLeft" className="form-label">
                                Margin Kiri:
                            </label>
                            <div className="input-group">
                                <input type="number" className="form-control" id="marginLeft" value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} min="0" step="0.1" />
                                <span className="input-group-text"> mm</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="tableWidth" className="form-label">
                                Lebar Tabel:
                            </label>
                            <div className="input-group">
                                <input type="number" className="form-control" id="tableWidth" value={tableWidth} onChange={(e) => setTableWidth(e.target.value)} min="0" step="0.1" />
                                <span className="input-group-text"> mm</span>
                            </div>
                        </div>
                    </form>
                    <Button label="Apply Settings" icon="pi pi-cog" onClick={handleApplySettings} className="btn btn-primary" style={{ marginRight: '10px', marginLeft: '20px' }} />
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

    // Fungsi untuk menangani perubahan dalam pengaturan margin dan lebar tabel
    const handleApplySettings = () => {
        // Check if localStorage is available (client-side)
        if (typeof window !== 'undefined' && window.localStorage) {
            // Save settings to localStorage
            window.localStorage.setItem('marginTop', marginTop);
            window.localStorage.setItem('marginLeft', marginLeft);
            window.localStorage.setItem('tableWidth', tableWidth);

            // Menyimpan nilai margin ke dalam variabel-variabel komponen
            setMarginTop(marginTop);
            setMarginLeft(marginLeft);
            setTableWidth(tableWidth);

            // Menyetel pengaturan langsung ke elemen tabel jika Anda ingin menerapkan perubahan secara langsung
            const table = document.getElementById('dataTable');
            table.style.marginTop = `${marginTop}mm`;
            table.style.marginLeft = `${marginLeft}mm`;
            table.style.width = `${tableWidth}mm`;
        }
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

            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true
            });

            const marginLeftInMm = parseFloat(marginLeft);
            const marginTopInMm = parseFloat(marginTop);
            const tableWidthInMm = parseFloat(tableWidth);

            doc.setProperties({
                marginLeft: marginLeftInMm,
                marginRight: 0,
                marginTop: marginTopInMm,
                landscape: false
            });

            // Perubahan ini: Mengganti pratinjau PDF dengan tabel yang berisi data yang dipilih
            const tableData = selectedData.map((rowData) => [rowData.NoTransaksi, rowData.Tgl, rowData.Kode, rowData.Debet, rowData.Kredit, rowData.Saldo, rowData.Keterangan]);

            doc.autoTable({
                body: tableData,
                startY: undefined,
                theme: 'grid',
                margin: { top: marginTopInMm, left: marginLeftInMm },
                tableWidth: tableWidthInMm,
                styles: { lineWidth: 0 }
            });

            // Menyimpan hasil PDF ke URL
            const pdfDataUrl = doc.output('datauristring');

            // Set state untuk menampilkan pratinjau PDF
            setPdfUrl(pdfDataUrl);
            setPdfPreviewOpen(true);
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Info',
                text: 'Pilih setidaknya satu data untuk dicetak.'
            });
        }
    };

    const apiDirPath = '/api/_apibase_crud/';
    const apiEndPointGet = '/api/teller/mutasiSimpanan/getDataTable';

    const loadLazyData = async () => {
        try {
            
            // const valRek = 10110001337;
            let requestBody = {
              Rekening: "10110001185",
            };
            const header = {
              "Content-Type": "application/json;charset=UTF-8",
              "X-ENDPOINT": apiEndPointGet,
            };
            const vaTable = await axios.post(apiDirPath, requestBody, {
              headers: header,
            });
            const json = vaTable.data;
            setTableData(json);
            console.log(json);
          } catch (error) {
            console.error("Error while loading data:", error);
          }

    };
    useEffect(() => {
        loadLazyData();
    }, []);

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
                        loading={loading}
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
            <Dialog visible={pdfPreviewOpen} onHide={() => setPdfPreviewOpen(false)} modal style={{ width: '80vw', minHeight: '80vh', marginBottom: '20px' }}>
                <div className="p-dialog-content">
                    {/* Menggunakan iframe untuk menampilkan pratinjau tabel */}
                    <iframe src={pdfUrl} style={{ width: '100%', height: '500px' }} title="Preview" />
                </div>
                <div className="p-dialog-footer">
                    {/* Tombol unduh PDF hanya ditampilkan di tampilan desktop */}
                    <a href={pdfUrl} download="preview.pdf" className="p-button-success p-md-display-none">
                        <Button label="Unduh PDF" icon="pi pi-download" />
                    </a>
                </div>
            </Dialog>
        </div>
    );
}
