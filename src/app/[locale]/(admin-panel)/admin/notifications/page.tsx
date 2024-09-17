import React from 'react'
import CreateNotificationModal from './components/create-notification-modal'
import { api } from '@/trpc/server'
import { DataTable } from '@/components/ui/custom/data-table';
import { columns } from './components/columns';
import PageTitle from '@/components/page-title';


const NotificationsPage = async () => {
    const systemNotifications = await api.notification.getSystemNotifications.query();

    return (
        <div className='container my-8'>
            <div className='mb-8'>
                <PageTitle >
                    Системні сповіщення
                </PageTitle>
            </div>

            <div className='mb-5'>
                <CreateNotificationModal />
            </div>

            <DataTable data={systemNotifications} columns={columns} />
        </div>
    )
}

export default NotificationsPage