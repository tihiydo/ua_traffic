"use client"
import { Button } from "@/components/ui/button"
import FormInput from "@/components/ui/custom/form/form-input"
import SpinnerLoading from "@/components/ui/custom/spinner-loading"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"
import { truncate } from "@/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type Props = {}

const DepositFee = (props: Props) => 
{
    const utils = api.useUtils();
    const {data: fee, isLoading: isLoadingFee} = api.fee.getFee.useQuery({type: "Deposit"})
    const {mutateAsync: mutateFee, isLoading} = api.fee.updateFee.useMutation(
        {
            onSuccess: (res) => 
            {
                if(res)
                {
                    utils.fee.getFee.setData({type: "Deposit"}, (prev) => 
                    {
                        return res.fee
                    })
                    toast.success("Успішно")
                }

            }
        }
    )
    
    const FormSchema = z.object
    ({
        fee: z.string().refine
        (el => 
            {
                const tryParse = parseFloat(el.replace(',', '.'))
                const result = !isNaN(tryParse) && typeof tryParse == "number"
                return result
            }, 
        {
            message: "Введіть будь ласка число, а не літери",
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>
    ({
        resolver: zodResolver(FormSchema),
        defaultValues: 
        {
            fee: "",
        },
    })
    const { control} = form

    function onSubmit(data: z.infer<typeof FormSchema>) 
    {
        mutateFee({newFee: parseFloat(data.fee.replace(',', '.')), type: "Deposit"})
    }

    return (
        <div className="flex h-[20rem]">
            <div className="flex-1 p-4 bg-gray-200 flex w-full items-center justify-center">
                <div>
                    <p className="font-bold">Поточна ставка:</p>
                    <p className="text-yellow text-5xl font-title">{!isLoadingFee ? fee + "%" : "0%"}</p>
                </div>
            </div>
            <div className="flex-1 p-4 bg-gray-300 flex w-full items-center justify-center">
                <div>
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} >
                            <FormInput control={control} name="fee" label="Нова поточна ставка:" placeholder="1%" transformChangeValue={(value, prevValue)=>
                                {
                                    if (value.length === 0) return value;
                                    const feeRegex = /^(?!0\d)(?!.*(?:[.,]){2})\d*(?:[.,]?\d{0,2})?$/;
                                    value = truncate(value, 5, false)
                                    const regexWork = feeRegex.test(value)
                                    const inDiapason = parseFloat(value) <= 100 && parseFloat(value) >= 0
 
                                    if(regexWork && inDiapason)
                                    {
                                        return value
                                    }
                                    else
                                    {
                                        return prevValue ?? ""
                                    }
                                }}/>
                                <div className="w-full text-center">
                                <Button type="submit" className="w-[11rem]">
                                {
                                    isLoading ? 
                                    <SpinnerLoading color="#000000"/> 
                                    :
                                    "Встановити ставку"
                                }
                                </Button>
                                </div>
                            </form>
                        </Form>
                </div>
            </div>
            <div className="flex-1 p-4 bg-gray-200 flex w-full items-center justify-center"></div>
        </div>
    )
}

export default DepositFee
