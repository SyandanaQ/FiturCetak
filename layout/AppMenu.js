import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Home',
            items: [
                /** Menu */
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
                { label: 'Kasir', icon: 'pi pi-fw pi-money-bill', to: '/kasir' },
                { label: 'CODEBASE 1', icon: 'pi pi-fw pi-star', to: '/_codebase/codebase1' },
                { label: 'GUDANG', icon: 'pi pi-fw pi-star', to: '/master/stok/gudang' },
                { label: 'Cetak', icon: 'pi pi-fw pi-star', to: '/cetak' },
                { label: 'Cetak Slip', icon: 'pi pi-fw pi-print', to: '/cetakslip' },
                { label: 'Cetak Slip Vers2', icon: 'pi pi-fw pi-print', to: '/cetakslip-vers2' },
                { label: 'Cetak PDF API', icon: 'pi pi-fw pi-ban', to: '/cetak-pdf' },
                { label: 'Cetak PDF vers2', icon: 'pi pi-fw pi-file-pdf', to: '/coba' },
                { label: 'Cetak PDFjs vers2(fix)', icon: 'pi pi-fw pi-file-pdf', to: '/cobapdfjs22' },
                { label: 'Coba pdfjs', icon: 'pi pi-fw pi-file-pdf', to: '/cobapdfjs' }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                {/* <Link href="https://www.primefaces.org/primeblocks-react" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`${contextPath}/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
