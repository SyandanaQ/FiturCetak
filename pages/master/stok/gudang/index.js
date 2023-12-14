import axios from "axios";
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { TabView, TabPanel } from 'primereact/tabview';
import { Skeleton } from 'primereact/skeleton';
import TabelSkaleton from '../../../../component/tabel/skaleton';
import { Paginator } from 'primereact/paginator';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Dropdown } from 'primereact/dropdown';

export default function MasterDummy(){
    const breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    const breadcrumbItems = [{ label: 'Master' }, { label: 'Stok' }, { label: 'Gudang ', to:'#' }];

    //hubungan dengan path api disini
    const apiDirPath = "/api/_apibase_crud/";
    //create
    const apiEndPointStore = "/api/gudang/store";
    //read
    const apiEndPointGet = "/api/gudang/get";
    //update
    const apiEndPointUpdate = "/api/gudang/update/";
    //delete
    const apiEndPointDelete = "/api/gudang/delete";
    //helper table
    // const apiDirPathHelper = "/api/_apibase_helper/";
    // const apiEndPointHelperRekening = "/api/rekening/get";


    let emptygudang = {
        KODE:null,
        KETERANGAN:null,
    };

    const toast = useRef(null);
    const dt = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCoa, setSelectedCoa] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [statusAction,setStatusAction] = useState(null);
    const [deleteGudangDialog, setDeleteGudangDialog] = useState(false);
    const [kodeError, setKodeError] = useState('');
    const [keteranganError, setKeteranganError] = useState('');

    const [defaultOption, setDropdownValue] = useState(null);
    const [gudang, setGudang] = useState(emptygudang);
    const [gudangDialog, setGudangDialog] = useState(false);
    const [gudangTabel, setGudangTabel] = useState(null);

    //  ------------------------------------------------------------------------------------------------------- Preparation
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {

        }
    });
    const itemsSkelaton = Array.from({ length: 2 }, (v, i) => i);
    const columns = [
        { field:'KODE',header: 'KODE'},
        { field:'KETERANGAN',header: 'KETERANGAN'},
    ];
    const dropdownValues = [
        { name: 'KODE', label: 'KODE' },
        { name: 'KETERANGAN', label: 'KETERANGAN' }
    ];
    const op = useRef(null);
    const onPage = (event) => {
        setlazyState(event);
    };

    useEffect(()=>{
        loadLazyData();
    },[lazyState]);

    const refreshTabel = ()=>{
        let getLazyState = {...lazyState};
        setlazyState(getLazyState);
    }

    const loadLazyData = async () => {
        setLoading(true);
        const header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointGet };
        const vaTable = await axios.post(apiDirPath, lazyState, { headers: header }); console.log(vaTable);
        const json = vaTable.data; console.log(json);
        setTotalRecords(json.total);
        setGudangTabel(json.data);
        setLoading(false);
    }
    // ---------------------------------------------------------------------------------------------------------------------- Toggle
    const togglePrintGudang = async (event) =>{
        let indeks = null;
        let skipRequest = false;

        setPrintGudangDialog(true);
        setActiveIndex(event.index ?? 0);
        setLoadingItem(true);
        if(skipRequest === false){
            const resPrintGudang = await dataTablePrintGudang(indeks);
            updateStatePrintGudang(indeks,resPrintGudang);
        }
        setLoadingItem(false);
    }

    // -------------------------------------------------------------------------------------------------------------------- Dialog
    const openNew = () => {
        setGudang(emptygudang);
        setSubmitted(false);
        setGudangDialog(true);
        setStatusAction('store');
    };

    // ----------------------------------------------------------------------------------------------------------------- Hide Dialog
    const hideDialog = () => {
        setSubmitted(false);
        setGudangDialog(false);
    };
    const hideDeleteGudangDialog = () => {
        setDeleteGudangDialog(false);
    };

    // -------------------------------------------------------------------------------------------------------------------- Func
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _gudang = { ...gudang };
        _gudang[`${name}`] = val;

        setGudang(_gudang);
        console.log(_gudang);
    };
    const validateFields = () => {
        setKodeError(!gudang.KODE ? 'Kode Harus diisi.' : (gudang.KODE.length > 4 ? 'Kode Tidak Boleh Lebih dari 4 Karakter.' : ''));
        setKeteranganError(!gudang.KETERANGAN ? 'Keterangan Harus diisi.' : '');
        return !(kodeError || keteranganError); // Mengembalikan false jika terdapat error
    };
    const saveGudang = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!validateFields()) {
            return;
        }
        let _gudangTabel = [...gudangTabel];
        let _gudang = { ...gudang };

        let header = {};
        let detail = null;
        if (statusAction == 'update') {
            const index = findIndexById(gudang.KODE);
            _gudangTabel[index] = _gudang;
            detail = 'update data berhasil';
            header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointUpdate, 'X-VALUEUPDATE': gudang.KODE };
        } else {
            _gudangTabel.push(_gudang);
            detail = 'data berhasil ditambahkan';
            header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointStore, 'X-VALUEUPDATE': '' };
        }
        //proses create / update data
        const vaProcess = await axios.post(apiDirPath, gudang, { headers: header });
        let data = vaProcess.data;
        if (data.status == 'success') {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: detail, life: 3000 });
            if (statusAction == 'update') {
                setGudangTabel(_gudangTabel);
                setGudang(emptygudang);
            } else {
                refreshTabel();
            }
            setGudangDialog(false);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'kesalahan proses', life: 3000 });
        }

    }

    const findIndexById = (KODE) => {
        let index = -1;
        for (let i = 0; i < gudangTabel.length; i++) {
            if (gudangTabel[i].KODE === KODE) {
                index = i;
                break;
            }
        }
        return index;
    };

    const editGudang = (gudang) => {
        setGudang({...gudang});
        setGudangDialog(true);
        setStatusAction('update');
    };

    const confirmDeleteGudang = (gudang) => {
        setGudang(gudang);
        setDeleteGudangDialog(true);
    };

    const deleteGudang = async () => {
        const header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointDelete, 'X-DELETEINDEX': gudang.KODE };
        const vaDelete = await axios.post(apiDirPath, gudang, { headers: header });
        let data = vaDelete.data;
        if (data.status == 'success') {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'data berhasil dihapus', life: 3000 });
            setGudang(emptygudang);
            setDeleteGudangDialog(false);
            refreshTabel();
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'data gagal dihapus', life: 3000 });
        }
    }

    // ---------------------------------------------------------------------------------------------------------------- Button
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} readOnly={!selectedgudangs || !selectedgudangs.length} /> */}
                </div>
            </React.Fragment>
        );
    };

    const previewGudang = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Preview" icon="pi pi-file-o" outlined className="p-button-secondary p-button-sm mr-2" />
                </div>
                {/* <div className="my-2">
                    <Button label="Print Gudang" icon="pi pi-print" outlined className="p-button-secondary p-button-sm mr-2" onClick={togglePrintGudang}/>
                </div> */}
            </React.Fragment>
        );
    };
    const gudangDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveGudang} />
        </>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editGudang(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteGudang(rowData)} />
            </>
        );
    };

    const deleteGudangDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteGudangDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteGudang} />
        </>
    );

    const headerSearch = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
          <h5 className="m-0"></h5>
          <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Dropdown value={defaultOption} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Pilih kolom" />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
              <i className="pi pi-search" />
              <InputText type="search" onInput={(e) => onSearch(e.target.value)} placeholder="Search..." />
            </span>
          </div>
        </div>
      );

    const onSearch = (value) => {
        let _lazyState = { ...lazyState };
        _lazyState['filters'] = {};
        if (defaultOption != null && defaultOption.name != null) {
          _lazyState['filters'][defaultOption.name] = value;
        }
        onPage(_lazyState);
      };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} style={{ background: 'none', border: 'none' }} />
                <div className="card">
                    <h4>Menu Gudang </h4><hr/>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        size="small"
                        value={gudangTabel}
                        lazy
                        dataKey="KODE"
                        paginator
                        rows={10}
                        className='datatable-responsive'
                        first={lazyState.first}
                        totalRecords={totalRecords}
                        onPage={onPage}
                        loading={loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} - {last} dari {totalRecords} data"
                        header={headerSearch}
                        filters={lazyState.filters}
                        emptyMessage="Data Kosong"
                    >
                        <Column field="KODE" header="KODE" ></Column>
                        <Column field="KETERANGAN" header="KETERANGAN" ></Column>
                        <Column header="ACTION" body={actionBodyTemplate}></Column>
                    </DataTable>
                    <Toolbar className="mb-4" left={previewGudang}></Toolbar>

                    {/* Dialog Gudang  */}
                    <Dialog visible={gudangDialog} style={{ width: '700px' }} header="Gudang " modal className="p-fluid" footer={gudangDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col-12 mb-2 lg:col-6">
                                <label htmlFor="kode">Kode</label>
                                <div className="p-inputgroup">
                                    <InputText autoFocus id="kode" value={gudang.KODE} onChange={(e) => onInputChange(e, 'KODE')} readOnly={statusAction === 'update'} className={classNames({ 'p-invalid': submitted && !gudang.KODE })} />
                                </div>
                                {submitted && ((!gudang.KODE || gudang.KODE.length > 4) && <small className="p-invalid">{kodeError}</small>)}
                            </div>
                            <div className="field col-12 mb-2 lg:col-6">
                                <label htmlFor="keterangan">Keterangan</label>
                                <InputText id="keterangan" value={gudang.KETERANGAN} onChange={(e) => onInputChange(e, 'KETERANGAN')} required  className={classNames({ 'p-invalid': submitted && !gudang.name })} />

                                {submitted && !gudang.KETERANGAN && (<small className="p-invalid">{keteranganError}</small>)}
                            </div>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteGudangDialog} header="Confirm" modal footer={deleteGudangDialogFooter} onHide={hideDeleteGudangDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {gudang && <span>are you sure you want to delete  <strong>{gudang.KODE}</strong></span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )

}
