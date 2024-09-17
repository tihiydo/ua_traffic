import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { type CellContext } from "@tanstack/react-table";
import { type ModerateAdReqTableData } from "./table";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { EyeIcon, Trash2Icon } from "lucide-react";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { toast } from "react-toastify";

const ActionsCell = ({ row }: CellContext<ModerateAdReqTableData, unknown>) => {
    const [open, setOpen] = useState(false);

    const utils = api.useUtils()
    const deleteAdReq = api.admin.advertisment.deleteAdRequest.useMutation({
        onSuccess: () => {
            setOpen(false);
            toast.success('Рекламна заявка успішно видалена')
            utils.admin.advertisment.getRequests.setData(undefined, (prevData) => {
                return prevData?.filter(req => req.id != row.original.id)
            })
        }
    });

    return <ActionsDropdown open={open} setOpen={setOpen}>
        <ActionItem>
            <Link href={`/admin/moderation/adv-requests/${row.original.id}`} className="flex items-center gap-x-2">
                <EyeIcon size={18} />
                Дивитися
            </Link>
        </ActionItem>
        <ActionItem
            disabled={deleteAdReq.isLoading}
            className={`flex items-center gap-x-2 ${deleteAdReq.isLoading ? "justify-center" : ''}`}
            onClick={
                () => {
                    deleteAdReq.mutate({ reqId: row.original.id })

                }
            }
        >
            {deleteAdReq.isLoading ? (
                <SpinnerLoading className="mx-auto" />
            ) : (
                <>
                    <Trash2Icon size={18} />
                    Видалити
                </>
            )}
        </ActionItem>
    </ActionsDropdown>
}

export default ActionsCell