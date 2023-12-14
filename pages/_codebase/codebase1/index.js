import axios from "axios";
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
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import TabelSkaleton from '../../../component/tabel/skaleton';


export default function MasterTemplate1() {
    //letak menu tampilan
    const breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    const breadcrumbItems = [{ label: 'CODEBASE 1' }];

    //hubungan dengan path api disini
    const apiDirPath = "/api/_apibase_crud/";
    //create
    const apiEndPointStore = "/api/bank/store";
    //read
    const apiEndPointGet = "/api/bank/get";
    //update
    const apiEndPointUpdate = "/api/bank/update/";
    //delete
    const apiEndPointDelete = "/api/bank/delete";
    //helper table
    const apiDirPathHelper = "/api/_apibase_helper/";
    const apiEndPointHelperRekening = "/api/rekening/get";

    let emptybank = {
        KODE: null,
        KETERANGAN: null,
        REKENING: null,
        ADMINISTRASI: null,
        PENARIKANTUNAI: null
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
    const [bankTabel, setBankTabel] = useState(null);
    const [rekening1, setRekening1] = useState(null);
    const [rekening2, setRekening2] = useState(null);
    const [rekening3, setRekening3] = useState(null);
    const [rekening4, setRekening4] = useState(null);
    const [rekening5, setRekening5] = useState(null);
    const [rekening6, setRekening6] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [rekeningDialog, setRekeningDialog] = useState(false);
    const [statusAction, setStatusAction] = useState(null);
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
        { field: 'KODE', header: 'KODE' },
        { field: 'KETERANGAN', header: 'KETERANGAN' },
        { field: 'JENISREKENING', header: 'JENISREKENING' }
    ];
    const dropdownValues = [
        { name: 'KODE', label: 'KODE' },
        { name: 'KETERANGAN', label: 'KETERANGAN' }
    ];

    //filter helper rekening
    const [globalFilter, setGlobalFilter] = useState('');
    const onFilterInput = (event) => {
        setGlobalFilter(event.target.value);
    };
    const clearFilter = () => {
        setGlobalFilter('');
    };
    const filterOptions = {
        global: { value: globalFilter, matchMode: 'contains' },
    };

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);

    const openNew = () => {
        setBank(emptybank);
        setSubmitted(false);
        setbankDialog(true);
        setStatusAction('store');
    };

    const hideDialog = () => {
        setSubmitted(false);
        setbankDialog(false);
    };

    const hideDeleteBankDialog = () => {
        setDeleteBankDialog(false);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _bank = { ...bank };
        console.log(_bank);
        _bank[`${name}`] = val;

        setBank(_bank);
    };
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _bank = { ...bank };
        _bank[`${name}`] = val;

        setBank(_bank);
    };
    const onPenarikanTunaiChange = (e) => {
        let _bank = { ...bank };
        _bank['PENARIKANTUNAI'] = e.value;
        setBank(_bank);
    };
    const saveBank = async (e) => {
        e.preventDefault();
        let _bankTabel = [...bankTabel];
        let _bank = { ...bank };

        let header = {};
        let detail = null;
        if (statusAction == 'update') {
            const index = findIndexById(bank.KODE);
            _bankTabel[index] = _bank;
            detail = 'update data berhasil';
            header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointUpdate, 'X-VALUEUPDATE': bank.KODE };
        } else {
            _bankTabel.push(_bank);
            detail = 'data berhasil ditambahkan';
            header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointStore, 'X-VALUEUPDATE': '' };
        }
        //proses create / update data
        const vaProcess = await axios.post(apiDirPath, bank, { headers: header });
        let data = vaProcess.data;
        if (data.status == 'success') {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: detail, life: 3000 });
            if (statusAction == 'update') {
                setBankTabel(_bankTabel);
                setBank(emptybank);
            } else {
                refreshTabel();
            }
            setbankDialog(false);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'kesalahan proses', life: 3000 });
        }

    }

    const refreshTabel = () => {
        let getLazyState = { ...lazyState };
        setlazyState(getLazyState);
    }

    const findIndexById = (KODE) => {
        let index = -1;
        for (let i = 0; i < bankTabel.length; i++) {
            if (bankTabel[i].KODE === KODE) {
                index = i;
                break;
            }
        }

        return index;
    };

    const editBank = (bank) => {
        setBank({ ...bank });
        setbankDialog(true);
        setStatusAction('update');
    };

    const confirmDeleteBank = (bank) => {
        setBank(bank);
        setDeleteBankDialog(true);
    };

    const deleteBank = async () => {
        const header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointDelete, 'X-DELETEINDEX': bank.KODE };
        const vaDelete = await axios.post(apiDirPath, bank, { headers: header });
        let data = vaDelete.data;
        if (data.status == 'success') {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'data berhasil dihapus', life: 3000 });
            setBank(emptybank);
            setDeleteBankDialog(false);
            refreshTabel();
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'data gagal dihapus', life: 3000 });
        }
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Add" icon="pi pi-plus" onClick={openNew} />
                    {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedbanks || !selectedbanks.length} /> */}
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
                <Button label="Export CSV" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const bankDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveBank} />
        </>
    );

    const deleteBankDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteBankDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteBank} />
        </>
    );

    const onPage = (event) => {
        setlazyState(event);
    };

    const onPageHelper = (event) => {
        setlazyStateHelper(event);
    };

    const penarikantunaiBodyTemplate = (rowData) => {
        return (
            <span> {(rowData.PENARIKANTUNAI == "Y") ? "YA" : "TIDAK"} </span>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="secondary" rounded className="mr-2" onClick={() => editBank(rowData)} />
                <Button icon="pi pi-trash" severity="danger" rounded onClick={() => confirmDeleteBank(rowData)} />
            </>
        );
    };

    const bodyJenisRekening = (rowData) => {
        return (
            <span>{(rowData.JENISREKENING == "I") ? "INDUK" : "DETAIL"}</span>
        )
    }
    const onRowSelect = (event) => {
        let _bank = { ...bank };
        _bank['REKENING'] = event.data.KODE;
        setBank(_bank);
        setRekeningDialog(false);
    }

    const toggleDataTable = async (event) => {
        // op.current.toggle(event);
        console.log(event);
        let indeks = null;
        let skipRequest = false;
        switch (event.index) {
            case 1:
                indeks = 2;
                rekening2 !== null ? skipRequest = true : '';
                break;
            case 2:
                indeks = 3;
                rekening3 !== null ? skipRequest = true : '';
                break;
            case 3:
                indeks = 4;
                rekening4 !== null ? skipRequest = true : '';
                break;
            case 4:
                indeks = 5;
                rekening5 !== null ? skipRequest = true : '';
                break;
            case 5:
                indeks = 6;
                rekening6 !== null ? skipRequest = true : '';
                break;

            default:
                indeks = 1;
                rekening1 !== null ? skipRequest = true : '';
                break;
        }

        setRekeningDialog(true);
        setActiveIndex(event.index ?? 0);
        setLoadingItem(true);
        clearFilter();
        if (skipRequest === false) {
            const resRekening = await dataTableRekening(indeks);
            // updateStateRekening(indeks,resRekening);
            //mengambil data dan menampilkan resRekening.data
            updateStateRekening(indeks, resRekening.data);
        }
        setLoadingItem(false);
    }

    const updateStateRekening = (indeks, data) => {
        console.log(data);
        switch (indeks) {
            case 2:
                setRekening2(data);
                break;
            case 3:
                setRekening3(data);
                break;
            case 4:
                setRekening4(data);
                break;
            case 5:
                setRekening5(data);
                break;
            case 6:
                setRekening6(data);
                break;

            default:
                setRekening1(data);
                break;
        }
    }

    const dataTableRekening = async (id) => {
        const header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointHelperRekening };
        const vaTable = await axios.post(apiDirPathHelper, { kode: id }, { headers: header });
        return vaTable.data;
    }

    const loadLazyData = async () => {
        setLoading(true);
        const header = { 'Content-Type': 'application/json;charset=UTF-8', 'X-ENDPOINT': apiEndPointGet };
        const vaTable = await axios.post(apiDirPath, lazyState, { headers: header });
        const json = vaTable.data;
        setTotalRecords(json.total);
        setBankTabel(json.data);
        setLoading(false);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0"> </h5>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <Dropdown value={defaultOption} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Pilih kolom" />
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => onSearch(e.target.value)} placeholder="Search..." />
                </span>
            </div>
        </div >
    );

    const headerHelperRekening = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0"> </h5>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                {/* <Dropdown value={defaultOption} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Pilih kolom" /> */}
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={onFilterInput} placeholder="Search..." />
                </span>
            </div>
        </div >
    );

    const onSearch = (e) => {
        let _lazyState = { ...lazyState };
        _lazyState['filters'] = {};
        if (defaultOption != null && defaultOption.name != null) {
            _lazyState['filters'][defaultOption.name] = e;
        }
        onPage(_lazyState);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} style={{ background: 'none', border: 'none' }} />
                <div className="card">
                    <h4>CODEBASE 1</h4><hr />
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={bankTabel}
                        lazy
                        dataKey="KODE"
                        paginator
                        rows={10}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} - {last} dari {totalRecords} data"
                        first={lazyState.first}
                        totalRecords={totalRecords}
                        onPage={onPage}
                        loading={loading}
                        header={header}
                        filters={lazyState.filters}
                        emptyMessage="Data Kosong"
                    >
                        {/* <Column field="NO" header="#" body={(rowData) => coa.indexOf(rowData) + 1}></Column> */}
                        <Column field="KODE" header="KODE" ></Column>
                        <Column field="KETERANGAN" header="KETERANGAN" ></Column>
                        <Column field="REKENING" header="REKENING" ></Column>
                        <Column field="ADMINISTRASI" header="ADMINISTRASI" ></Column>
                        <Column field="PENARIKANTUNAI" body={penarikantunaiBodyTemplate} header="PENARIKAN TUNAI" ></Column>
                        <Column header="ACTION" body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={bankDialog} style={{ width: '650px' }} header="Bank Details" modal className="p-fluid" footer={bankDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="kode">Kode</label>
                            <InputText id="kode" value={bank.KODE} onChange={(e) => onInputChange(e, 'KODE')} required autoFocus className={classNames({ 'p-invalid': submitted && !bank.kode })} />
                            {submitted && !bank.kode && <small className="p-invalid">kode is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="keterangan">Keterangan</label>
                            <InputText id="keterangan" value={bank.KETERANGAN} onChange={(e) => onInputChange(e, 'KETERANGAN')} required className={classNames({ 'p-invalid': submitted && !bank.name })} />
                            {submitted && !bank.keterangan && <small className="p-invalid">keterangan is required.</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="rekening">Rekening</label>
                                {/* <InputText id="rekening" value={bank.name} onChange={(e) => onInputChange(e, 'rekening')} required autoFocus className={classNames({ 'p-invalid': submitted && !bank.rekening })} /> */}
                                <div className="p-inputgroup">
                                    <InputText id="rekening" value={bank.REKENING} onChange={(e) => onInputChange(e, 'REKENING')} className={classNames({ 'p-invalid': submitted && !bank.REKENING })} />
                                    <Button icon="pi pi-search" className="p-button" onClick={toggleDataTable} />
                                </div>
                                {submitted && !bank.rekening && <small className="p-invalid">rekening is required.</small>}

                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="administrasi">Administrasi</label>
                                <InputNumber id="administrasi" value={bank.ADMINISTRASI} onValueChange={(e) => onInputNumberChange(e, 'ADMINISTRASI')} mode="currency" currency="IDR" locale="id-ID" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="mb-3">Penarikan Tunai</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="penarikantunai1" name="penarikantunai" value="Y" onChange={onPenarikanTunaiChange} checked={bank.PENARIKANTUNAI === 'Y'} />
                                    <label htmlFor="penarikantunai1">Ya</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="penarikantunai2" name="penarikantunai" value="T" onChange={onPenarikanTunaiChange} checked={bank.PENARIKANTUNAI !== 'Y'} />
                                    <label htmlFor="penarikantunai2">Tidak</label>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                    <Dialog visible={rekeningDialog} header="Rekening" modal className="p-fluid" onHide={() => setRekeningDialog(false)}>
                        <TabView activeIndex={activeIndex} onTabChange={toggleDataTable}>
                            <TabPanel header="ASET">
                                {loadingItem &&
                                    <TabelSkaleton items={itemsSkelaton} kolom={columns} />
                                }
                                {!loadingItem &&
                                    <DataTable
                                        value={rekening1}
                                        onRowSelect={onRowSelect}
                                        selectionMode="single"
                                        header={headerHelperRekening}
                                        globalFilter={globalFilter}
                                        filter
                                        filterOptions={filterOptions}
                                        filterMode="match"
                                        emptyMessage="Data Kosong"
                                    >
                                        <Column field='KODE' header='KODE' />
                                        <Column field='KETERANGAN' header='KETERANGAN' />
                                        <Column field='JENISREKENING' header='JENISREKENING' body={bodyJenisRekening} />
                                    </DataTable>
                                }
                            </TabPanel>
                            <TabPanel header="KEWAJIBAN">
                                {loadingItem &&
                                    <TabelSkaleton items={itemsSkelaton} kolom={columns} />
                                }
                                {!loadingItem &&
                                    <DataTable
                                        value={rekening2}
                                        onRowSelect={onRowSelect}
                                        selectionMode="single"
                                        header={headerHelperRekening}
                                        globalFilter={globalFilter}
                                        filter
                                        filterOptions={filterOptions}
                                        filterMode="match"
                                        emptyMessage="Data Kosong"
                                    >
                                        <Column field='KODE' header='KODE' />
                                        <Column field='KETERANGAN' header='KETERANGAN' />
                                        <Column field='JENISREKENING' header='JENISREKENING' body={bodyJenisRekening} />
                                    </DataTable>
                                }
                            </TabPanel>
                            <TabPanel header="MODAL">
                                {loadingItem &&
                                    <TabelSkaleton items={itemsSkelaton} kolom={columns} />
                                }
                                {!loadingItem &&
                                    <DataTable
                                        value={rekening3}
                                        onRowSelect={onRowSelect}
                                        selectionMode="single"
                                        header={headerHelperRekening}
                                        globalFilter={globalFilter}
                                        filter
                                        filterOptions={filterOptions}
                                        filterMode="match"
                                        emptyMessage="Data Kosong"
                                    >
                                        <Column field='KODE' header='KODE' />
                                        <Column field='KETERANGAN' header='KETERANGAN' />
                                        <Column field='JENISREKENING' header='JENISREKENING' body={bodyJenisRekening} />
                                    </DataTable>
                                }
                            </TabPanel>
                            <TabPanel header="PENDAPATAN">
                                {loadingItem &&
                                    <TabelSkaleton items={itemsSkelaton} kolom={columns} />
                                }
                                {!loadingItem &&
                                    <DataTable
                                        value={rekening4}
                                        onRowSelect={onRowSelect}
                                        selectionMode="single"
                                        header={headerHelperRekening}
                                        globalFilter={globalFilter}
                                        filter
                                        filterOptions={filterOptions}
                                        filterMode="match"
                                        emptyMessage="Data Kosong"
                                    >
                                        <Column field='KODE' header='KODE' />
                                        <Column field='KETERANGAN' header='KETERANGAN' />
                                        <Column field='JENISREKENING' header='JENISREKENING' body={bodyJenisRekening} />
                                    </DataTable>
                                }
                            </TabPanel>
                            <TabPanel header="BIAYA">
                                {loadingItem &&
                                    <TabelSkaleton items={itemsSkelaton} kolom={columns} />
                                }
                                {!loadingItem &&
                                    <DataTable
                                        value={rekening5}
                                        onRowSelect={onRowSelect}
                                        selectionMode="single"
                                        header={headerHelperRekening}
                                        globalFilter={globalFilter}
                                        filter
                                        filterOptions={filterOptions}
                                        filterMode="match"
                                        emptyMessage="Data Kosong"
                                    >
                                        <Column field='KODE' header='KODE' />
                                        <Column field='KETERANGAN' header='KETERANGAN' />
                                        <Column field='JENISREKENING' header='JENISREKENING' body={bodyJenisRekening} />
                                    </DataTable>
                                }
                            </TabPanel>
                            <TabPanel header="ADMINISTRATIF">
                                {loadingItem &&
                                    <TabelSkaleton items={itemsSkelaton} kolom={columns} />
                                }
                                {!loadingItem &&
                                    <DataTable
                                        value={rekening6}
                                        onRowSelect={onRowSelect}
                                        selectionMode="single"
                                        header={headerHelperRekening}
                                        globalFilter={globalFilter}
                                        filter
                                        filterOptions={filterOptions}
                                        filterMode="match"
                                        emptyMessage="Data Kosong"
                                    >
                                        <Column field='KODE' header='KODE' />
                                        <Column field='KETERANGAN' header='KETERANGAN' />
                                        <Column field='JENISREKENING' header='JENISREKENING' body={bodyJenisRekening} />
                                    </DataTable>
                                }
                            </TabPanel>
                        </TabView>
                    </Dialog>
                    <Dialog visible={deleteBankDialog} header="Confirm" modal footer={deleteBankDialogFooter} onHide={hideDeleteBankDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {bank && <span>Yakin ingin menghapus <strong>{bank.KODE} ?</strong></span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}