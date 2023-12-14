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

export default function MasterDummy(){
    const breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    const breadcrumbItems = [{ label: 'Master' }, { label: 'Stok' }, { label: 'Rak', to:'#' }];

    let emptydummy = {
        KODE:null,
    };

    const toast = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCoa, setSelectedCoa] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dummy, setDummy] = useState(emptydummy);
    const [dummyDialog, setDummyDialog] = useState(false);

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {

        }
    });
    const itemsSkelaton = Array.from({ length: 2 }, (v, i) => i);
    const columns = [
        { field:'KODE',header: 'KODE'},
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
        // const dataBank = await fetch('/api/bank',{
        //     method:"POST",
        //     headers:{ "Content-Type": "application/json","X-ACTION":"get" },
        //     body:JSON.stringify(lazyState)
        // }).then((result)=> result.text())
        // .then((body)=>{return body });
        // const jsonBank = JSON.parse(dataBank);
        // setTotalRecords(jsonBank.total);
        // setCoa(jsonBank.data);
        setLoading(false);
    }
    // ----------------------------------------------------------------------------------------------------------------- Hide Dialog
    const hideDialog = () => {
        setSubmitted(false);
        setDummyDialog(false);
    };

    // -------------------------------------------------------------------------------------------------------------------- Dialog
    const openNew = () => {
        // setCustomer(emptycustomer);
        setSubmitted(false);
        setDummyDialog(true);
        // setStatusAction('store');
    };

    // -------------------------------------------------------------------------------------------------------------------- Func
    const saveDummy = async (e)=>{
        e.preventDefault();
    }

    // ---------------------------------------------------------------------------------------------------------------- Button
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedbanks || !selectedbanks.length} /> */}
                </div>
            </React.Fragment>
        );
    };
    const dummyDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDummy} />
        </>
    );


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} style={{ background: 'none', border: 'none' }} />
                <div className="card">
                    <h4>Menu Dummy</h4><hr/>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable
                        // value={dummy}
                        lazy
                        // dataKey="KODE"
                        // paginator
                        rows={10}
                        className='datatable-responsive'
                        first={lazyState.first}
                        totalRecords={totalRecords}
                        onPage={onPage}
                        loading={loading}
                    >
                        <Column field="KODE" header="KODE" ></Column>
                        <Column field="KETERANGAN" header="KETERANGAN" ></Column>
                        {/* <Column header="ACTION" body={actionBodyTemplate}></Column> */}
                    </DataTable>

                    {/* Dialog Dummy  */}
                    <Dialog visible={dummyDialog} style={{ width: '700px' }} header="Tambah Dummy " modal className="p-fluid" footer={dummyDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col-12 mb-2 lg:col-6">
                                <label htmlFor="kode">Kode</label>
                                <div className="p-inputgroup">
                                    <InputText disabled id="kode" value={dummy.KODE} onChange={(e) => onInputChange(e, 'KODE')} className={classNames({ 'p-invalid': submitted && !dummy.KODE })} />
                                </div>
                                {submitted && !dummy.KODE && <small className="p-invalid">Kode is required.</small>}
                            </div>
                            <div className="field col-12 mb-2 lg:col-6">
                                <label htmlFor="keterangan">Keterangan</label>
                                <InputText id="keterangan" value={dummy.Keterangan} onChange={(e) => onInputChange(e, 'Keterangan')} required autoFocus className={classNames({ 'p-invalid': submitted && !dummy.Keterangan })} />
                                {submitted && !dummy.KETERANGAN && <small className="p-invalid">Keterangan is required.</small>}
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )

}
