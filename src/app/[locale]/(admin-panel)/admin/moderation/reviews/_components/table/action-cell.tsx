import { api } from "@/trpc/react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { EyeIcon, Trash2Icon } from "lucide-react";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { toast } from "react-toastify";
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { type CellContext } from "@tanstack/react-table";
import { type ModerateReviewTableData } from "./table";
import EditReviewModal from '../editReviewModal';

const ActionsCell = ({ row }: CellContext<ModerateReviewTableData, unknown>) => {
    const [open, setOpen] = useState(false);

    const utils = api.useUtils()
    const deleteReview = api.admin.reviews.deleteReview.useMutation({
        onSuccess: () => {
            setOpen(false);
            toast.success('Відгук успішно видалено');
            utils.admin.reviews.getReviews.invalidate();
        }
    });

    return <ActionsDropdown open={open} setOpen={setOpen}>
        <ActionItem>
            <Link href={`/admin/moderation/reviews/${row.original.id}`} className="flex items-center gap-x-2">
                <EyeIcon size={18} />
                Подивитися
            </Link>
        </ActionItem>
        <ActionItem
            disabled={deleteReview.isLoading}
            className={`flex items-center gap-x-2 ${deleteReview.isLoading ? "justify-center" : ''}`}
            onClick={() => deleteReview.mutate({ reviewId: row.original.id })}
        >
            {deleteReview.isLoading ? (
                <SpinnerLoading className="mx-auto" />
            ) : (
                <>
                    <Trash2Icon size={18} />
                    Видалити
                </>
            )}
        </ActionItem>
        <ActionItem>
           <EditReviewModal
                reviewId={row.original.id}
                initialData={{
                    professionalism: row.original.professionalism,
                    quality: row.original.quality,
                    price: row.original.price,
                    communication: row.original.communication,
                    text: row.original.text,
                }}
            />
        </ActionItem>
    </ActionsDropdown>
}

export default ActionsCell;