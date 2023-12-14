import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import axios from 'axios';

// Data JSON
import data from './data.json';

export default function index() {
    // Letak menu tampilan
    const breadcrumbHome = { icon: 'pi pi-home', url: '/' };
    const breadcrumbItems = [{ label: 'Cetak' }];

    let emptybank = {
        KODE: null,
        KETERANGAN: null,
        REKENING: null,
        ADMINISTRASI: null,
        PENARIKANTUNAI: null
    };

    const [tableData, setTableData] = useState(data);
    const [selectedData, setSelectedData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    useEffect(() => {
        // Update selected data when 'selectAll' changes
        if (selectAll) {
            setSelectedData(tableData);
        } else {
            setSelectedData([]);
        }
    }, [selectAll, tableData]);

    // Function to handle individual checkbox selection
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
    const [bankDialog, setbankDialog] = useState(false);
    const [deleteBankDialog, setDeleteBankDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [bank, setBank] = useState(emptybank);
    const [defaultOption, setDropdownValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    // const [bankTabel, setBankTabel] = useState(dummyData); // Menggunakan data dummy di sini
    const [rekening1, setRekening1] = useState(null);
    const [rekening2, setRekening2] = useState(null);
    const [rekening3, setRekening3] = useState(null);
    const [rekening4, setRekening4] = useState(null);
    const [rekening5, setRekening5] = useState(null);
    const [rekening6, setRekening6] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [rekeningDialog, setRekeningDialog] = useState(false);
    const [statusAction, setStatusAction] = useState(null);

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <form id="marginForm" style={{ margin: '20px' }}>
                        <label>
                            Margin Atas:
                            <input type="number" name="marginTop" value={marginTop} onChange={(e) => setMarginTop(e.target.value)} style={{ marginLeft: '3px', marginBottom: '3px' }} />
                            mm
                        </label>
                        <br />
                        <label>
                            Margin Kiri:
                            <input type="number" name="marginLeft" value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} style={{ marginLeft: '10px', marginBottom: '3px' }} />
                            mm
                        </label>
                        <br />
                        <label>
                            Lebar Tabel:
                            <input type="number" name="tableWidth" value={tableWidth} onChange={(e) => setTableWidth(e.target.value)} style={{ marginLeft: '8px', marginBottom: '3px' }} />
                            mm
                        </label>
                        <br />
                    </form>

                    <Button label="Apply Settings" icon="pi pi-cog" onClick={handleApplySettings} style={{ marginRight: '10px', marginLeft: '20px' }} />
                    {/* <Button label="Ceklis Semua" icon="pi pi-print" style={{ marginRight: '10px' }}/> */}
                    {/* <Button
                        label="Select All"
                        icon="pi pi-check"
                        onClick={handleSelectAllClick}
                    /> */}
                    {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedbanks || !selectedbanks.length} /> */}
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Cetak Data Terpilih" icon="pi pi-print" className="p-button-success" onClick={handlePrintSelected} style={{ marginRight: '10px', marginTop: '106px' }} />
            </React.Fragment>
        );
    };

    const openNew = () => {
        setBank(emptybank);
        setSubmitted(false);
        setbankDialog(true);
        setStatusAction('store');
    };

    const onPage = (event) => {
        setlazyState(event);
    };

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {}
    });


    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const hideDialog = () => {
        setBankDialog(false);
    };

    const hideDeleteBankDialog = () => {
        setDeleteBankDialog(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editBank(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteBank(rowData)} />
            </div>
        );
    };

    const deleteBank = () => {
        const updatedBankTabel = bankTabel.filter((bankItem) => bankItem.KODE !== bank.KODE);
        setBankTabel(updatedBankTabel);
        setDeleteBankDialog(false);
        setBank(emptybank);
    };

    const deleteBankDialogFooter = (
        <div>
            <Button label="Tidak" icon="pi pi-times" className="p-button-text" onClick={hideDeleteBankDialog} />
            <Button label="Ya" icon="pi pi-check" className="p-button-text" onClick={deleteBank} />
        </div>
    );

    // Variabel state untuk mengelola pengaturan margin dan lebar tabel
    const [marginTop, setMarginTop] = useState('');
    const [marginLeft, setMarginLeft] = useState('');
    const [tableWidth, setTableWidth] = useState('');

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

    // Fungsi untuk menangani tombol "Cetak Data Terpilih"
    const handlePrintSelected = () => {
        if (selectedData.length > 0) {
            // Membuat HTML untuk preview pencetakan
            const printWindow = window.open('', '_blank');
            // printWindow.document.write('<html><head><title>Preview Cetak</title></head><body>');

            // Menggunakan pengaturan margin dan lebar tabel yang diterapkan oleh pengguna
            printWindow.document.write('<style>');
            printWindow.document.write(`body { margin-top: ${marginTop}; margin-left: ${marginLeft}; }`);
            printWindow.document.write(`table { width: ${tableWidth}; }`);
            printWindow.document.write('</style>');

            printWindow.document.write('<table>');
            printWindow.document.write('<thead>');
            printWindow.document.write('<tr>');
            printWindow.document.write('</tr>');
            printWindow.document.write('</thead>');
            printWindow.document.write('<tbody>');

            selectedData.forEach((rowData) => {
                printWindow.document.write('<tr>');
                printWindow.document.write(`<td>${rowData.NoTransaksi}</td>`);
                printWindow.document.write(`<td>${rowData.Tgl}</td>`);
                printWindow.document.write(`<td>${rowData.Kode}</td>`);
                printWindow.document.write(`<td>${rowData.Debet}</td>`);
                printWindow.document.write(`<td>${rowData.Kredit}</td>`);
                printWindow.document.write(`<td>${rowData.Saldo}</td>`);
                printWindow.document.write(`<td>${rowData.Keterangan}</td>`);
                printWindow.document.write('</tr>');
            });

            printWindow.document.write('</tbody>');
            printWindow.document.write('</table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();

            // Mencetak preview
            printWindow.print();
        } else {
            alert('Pilih setidaknya satu data untuk dicetak.');
        }
    };

    // const apiDirPath = '/api/_apibase_crud/';
    // const apiEndPointGet = '/api/teller/mutasiSimpanan/getDataTable';

    // const loadLazyData = async () => {
    //     try {
            
    //         // const valRek = 10110001337;
    //         let requestBody = {
    //           Rekening: "10110001185",
    //         };
    //         const header = {
    //           "Content-Type": "application/json;charset=UTF-8",
    //           "X-ENDPOINT": apiEndPointGet,
    //         };
    //         const vaTable = await axios.post(apiDirPath, requestBody, {
    //           headers: header,
    //         });
    //         const json = vaTable.data;
    //         setTableData(json);
    //         console.log(json);
    //       } catch (error) {
    //         console.error("Error while loading data:", error);
    //       }

    // };
    // useEffect(() => {
    //     loadLazyData();
    // }, []);

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} style={{ background: 'none', border: 'none' }} />
                <div className="card">
                    <h4>Cetak HTML</h4>
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
                        {/* Kolom Checkbox */}
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

                    <script src="/scripts.js"></script>
                </div>
            </div>
        </div>
    );
}
