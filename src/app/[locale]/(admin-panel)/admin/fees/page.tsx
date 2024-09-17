import { redirect } from '@/i18n/navigation'

type Props = {}

const AdminHomePage = async (props: Props) => {
    redirect('/admin/fees/deposit')
}

export default AdminHomePage