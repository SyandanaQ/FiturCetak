import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import Restricted from '../component/page/restricted';
import React from 'react';
import ContentDashboard1 from './dashboard/ContentDashboard1' ;
import ContentDashboard2 from './dashboard/ContentDashboard2';
import ContentDashboard3 from './dashboard/ContentDashboard3';
import ContentDashboard6 from './dashboard/ContentDashboard6';

export default function Dashboard() {
    // const router = useRouter();
    const { data: session, status } = useSession();
    console.log(session);

    return (
        <div>
            <h1>Dashboard</h1>
            <ContentDashboard1 />
            <ContentDashboard2 />
            <ContentDashboard3 />
            <ContentDashboard6 />
        </div>
    );
}
