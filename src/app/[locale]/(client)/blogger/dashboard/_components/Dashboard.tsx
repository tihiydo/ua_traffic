'use client'

import React, { useState } from 'react'
import { api } from '@/trpc/react'
import Translate from '@/components/Translate'
import { DataTable } from '@/components/ui/custom/data-table'
import { columns as requestColumns } from '../../my-requests/_components/columns'
import { columns as channelsColumns } from '../../my-channels/_components/columns'
import { ChevronRight, FileText, MessageCircle, Wallet, StickyNote, Folders, PlusCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import ChatsList from '@/modules/chat/components/chats-list'
import { Button } from '@/components/ui/button'
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Skeleton } from '@/components/ui/skeleton'
import ActionsDropdown, { ActionItem } from "@/components/actions-dropdown";
import { toast } from 'react-toastify'
import { useLocale, useTranslations } from 'next-intl'
import { useChats } from '@/modules/chat/hooks/use-chats'
import { useRouter } from 'next/navigation'
import { type RealtimeChat } from '@/modules/chat/types'
import TransferMoneyModal from '../../billing/_components/transferModal';



type SectionHeaderProps = {
  icon: React.ElementType;
  title: React.ReactNode;
  link?: string;
  onAdd?: () => void;
  showChevron?: boolean;
  locale?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, className, locale, link, onAdd, showChevron = true }) => (

    <div className= "flex flex-col w-full">
        <div className={`flex items-center justify-between text-[18px] leading-[21px] p-4 ${className}`}>
            {link ? (
                <Link href={`/${locale}${link}`} className="flex items-center group">
                    <Icon className="mr-2 h-[30px] w-[30px]" />
                    <h2 className="text-size-[18px] leading-[21px] font-bold">{title}</h2>
                    {showChevron && (
                        <ChevronRight className="ml-2 w-[30px] h-[30px] text-slate-200 transition-all duration-300 group-hover:translate-x-1 group-hover:text-yellow" />
                    )}
                </Link>
            ) : (
                <div className="flex items-center">
                    <Icon className="mr-2 h-[30px] w-[30px]" />
                    <h2 className="text-size-[18px] leading-[21px] font-bold">{title}</h2>
                </div>
            )}
            <div className="flex items-center">
                {onAdd && (
                    <Button variant="ghost" size="icon" onClick={onAdd}>
                        <PlusCircle className="h-[35px] w-[35px] text-slate-200" />
                    </Button>
                )}
            </div>
        </div>
        <div className="w-full h-px bg-slate-300"></div>
    </div>
)

type TodoSection = {
  id: string;
  name: string;
  todos: Todo[];
}

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type openDropdowns = Record<string, boolean>

const Dashboard: React.FC = () => {
    const router = useRouter();
    
    const { data: user, isLoading: isUserLoading } = api.user.getMyUser.useQuery()
    const { data: requests, isLoading: isRequestsLoading } = api.advertisment.requests.getMyBloggersRequests.useQuery();
    const { data: channels, isLoading: isChannelsLoading } = api.blogger.getAllMyChannels.useQuery()
    const { data: chats = [], isLoading: isChatsLoading } = api.chat.getBloggerChats.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const { data: todoSections = [], refetch: refetchTodoSections } = api.user.getTodoSections.useQuery()
    const addTodoSectionMutation = api.user.addTodoSection.useMutation()
    const updateTodoSectionMutation = api.user.updateTodoSection.useMutation()
    const deleteTodoSectionMutation = api.user.deleteTodoSection.useMutation()
    const addTodoMutation = api.user.addTodo.useMutation()
    const toggleTodoMutation = api.user.toggleTodo.useMutation()
    const deleteTodoMutation = api.user.deleteTodo.useMutation()
    const [showNewTodoInput, setShowNewTodoInput] = useState<string | null>(null)

    const [newSectionName, setNewSectionName] = useState('')
    const [showSectionInput, setShowSectionInput] = useState(false)
    const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null)
    const [newTodoText, setNewTodoText] = useState('')
    const [openDropdowns, setOpenDropdowns] = useState<openDropdowns>({})

    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [editingSectionName, setEditingSectionName] = useState('');
    const stateChats = useChats(chats);
    const locale = useLocale();


    const handleChatSelect = (chat: RealtimeChat) => {
        router.push(`/${locale}/blogger/chats?chat=${chat.chat.id}`);
    };

    const t = useTranslations('Advertiser')

    const handleEditSection = (section: TodoSection) => {
        setEditingSectionId(section.id);
        setEditingSectionName(section.name);
    };

    const saveSectionName = async (id: string) => {
        await updateTodoSection(id, editingSectionName);
        setEditingSectionId(null);
        setEditingSectionName('');
    };


    const addTodoSection = async () => {
        if (newSectionName.trim() && todoSections.length < 3) {
            try {
                await addTodoSectionMutation.mutateAsync({ name: newSectionName });
                setNewSectionName('');
                setShowSectionInput(false);
                refetchTodoSections();
                notifySuccess(t('sectionAdded'));
            } catch (error) {
                notifyError(t('sectionAddError'));
            }
        } else if (todoSections.length >= 3) {
            notifyError(t('sectionLimit'));
        }
    };

    
    const updateTodoSection = async (id: string, name: string) => {
        try {
            await updateTodoSectionMutation.mutateAsync({ id, name });
            refetchTodoSections();
            notifySuccess(t('sectionUpdated'));
        } catch (error) {
            notifyError(t('sectionUpdateError'));
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            await deleteTodoMutation.mutateAsync({ id });
            refetchTodoSections();
        } catch (error) {
        }
    }


    const addTodo = async (sectionId: string) => {
        if (newTodoText.trim()) {
            await addTodoMutation.mutateAsync({ text: newTodoText, sectionId })
            setNewTodoText('')
            refetchTodoSections()
        }
    }

    const toggleTodo = async (id: string, completed: boolean) => {
        await toggleTodoMutation.mutateAsync({ id, completed: !completed })
        refetchTodoSections()
    }

    const deleteTodoSection = async (id: string) => {
        try {
            await deleteTodoSectionMutation.mutateAsync({ id });
            refetchTodoSections();
            notifySuccess(t('sectionDeleted'));
        } catch (error) {
            notifyError(t('sectionDeleteError'));
        }
    };

    const notifySuccess = (message: any) => toast.success(message);
    const notifyError = (message: any) => toast.error(message);


    const toggleSectionExpand = (sectionId: string) => {
        setExpandedSectionId(prevId => prevId === sectionId ? null : sectionId)
    }

    const toggleDropdown = (sectionId: string) => {
        setOpenDropdowns(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
    }

    return (
        <>
            <h1 className="text-[30px] leading-[35px] font-bold mb-4">
                <Translate namespace="Blogger" itemKey="dashboard" />
            </h1>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-full">
                <div className="space-y-8 xl:col-span-2">
                    <section className="border border-gray-300 rounded-lg">
                        <SectionHeader 
                            icon={FileText} 
                            title={<Translate namespace="Blogger" itemKey="myorders" />}
                            link="/blogger/my-requests"
                            showChevron={true}
                            locale={locale}
                        />
                        <DataTable
                            isLoading={isRequestsLoading}
                            columns={requestColumns}
                            data={(requests || []).slice(0, 4)}
                            disablePagination={true}
                            hideHeader={true}
                            noBorder={true}
                        />
                    </section>

                    <section className="border border-gray-300 rounded-lg">
                        <SectionHeader 
                            icon={Folders} 
                            title={<Translate namespace="Blogger" itemKey="mychannels" />}
                            link="/blogger/my-channels"
                            showChevron={true}
                            locale={locale}
                        />
                        <DataTable
                            isLoading={isChannelsLoading}
                            columns={channelsColumns}
                            data={(channels || []).slice(0, 4)}
                            disablePagination={true}
                            hideHeader={true}
                            noBorder={true}
                        />
                    </section>
                </div>

                <div className="xl:col-span-1">
                    <section className="border border-gray-300 rounded-lg flex flex-col h-full">
                        <SectionHeader 
                            icon={MessageCircle} 
                            title={<Translate namespace="Blogger" itemKey="chats" />}
                            link="/blogger/chats"
                            showChevron={true}
                            locale={locale}
                        />
                        <div className="flex-grow flex justify-center overflow-hidden">
                            {isChatsLoading ? (
                                <div className="space-y-2 p-3 w-full">
                                    <Skeleton className="h-36 w-full" />
                                </div>
                            ) : (
                                <ChatsList
                                    className='lg:w-full p-2'
                                    isLoading={isChatsLoading} 
                                    stateChats={Object.values(stateChats)}
                                    selectedChat={undefined}
                                    hideSearch={true}
                                    onSelect={handleChatSelect}
                                />
                            )}
                        </div>
                    </section>
                </div>

                <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <section className="border border-gray-300 rounded-lg md:col-span-1">
                        <SectionHeader 
                            icon={StickyNote}
                            className='p-[11px]'
                            title={<Translate namespace="Advertiser" itemKey="notes" />}
                            onAdd={() => {
                                if (todoSections.length >= 3) {
                                    notifyError(t('sectionLimit'));
                                } else {
                                    setShowSectionInput(true);
                                }
                            }}
                            showChevron={false}
                        />
                        <div className="space-y-2 max-h-[200px] overflow-y-auto" style={{ scrollbarColor: '#FFDD5F transparent' }}>
                            {showSectionInput && todoSections.length < 3 && (
                                <div className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={newSectionName}
                                        onChange={(e) => setNewSectionName(e.target.value)}
                                        placeholder={t('newSectionPlaceholder')}
                                        className="flex-grow p-2 mt-2 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow mr-2"
                                        onKeyPress={(e) => e.key === 'Enter' && addTodoSection()}
                                    />
                                    <Button className='mt-2 mr-3' onClick={addTodoSection} variant={'default'}>
                                        <Translate namespace="Blogger" itemKey="add" />
                                    </Button>
                                </div>
                            )}
                            {todoSections.map((section: TodoSection, sectionIndex) => (
                                <div key={section.id} className={`p-2 ${sectionIndex !== todoSections.length - 1 ? '' : ''}`}>
                                    <div className="flex items-center justify-between bg-amber-100 p-1 rounded-lg">
                                        <div className="flex items-center justify-between w-full">
                                            {editingSectionId === section.id ? (
                                                <div className="flex items-center w-full">
                                                    <input
                                                        type="text"
                                                        value={editingSectionName}
                                                        onChange={(e) => setEditingSectionName(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && saveSectionName(section.id)}
                                                        className="flex-grow p-2 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow mr-2"
                                                    />
                                                    <Button 
                                                        onClick={() => saveSectionName(section.id)} 
                                                        variant="default" 
                                                        size="sm"
                                                        className="mr-2"
                                                    >
                                                        <Translate namespace="Profile" itemKey="save" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <h3 className="ml-3 font-bold">{section.name}</h3>
                                            )}
                                            <div className="flex items-center">
                                                <ActionsDropdown 
                                                    open={openDropdowns[section.id] || false} 
                                                    setOpen={() => toggleDropdown(section.id)}
                                                >
                                                    <ActionItem onClick={() => handleEditSection(section)}>
                                                        <Translate namespace="Blogger" itemKey="edit" />
                                                    </ActionItem>
                                                    <ActionItem onClick={() => deleteTodoSection(section.id)}>
                                                        <Translate namespace="Default" itemKey="delete" />
                                                    </ActionItem>
                                                </ActionsDropdown>
                                                <button onClick={() => toggleSectionExpand(section.id)} className="ml-2">
                                                    <ChevronRight className={`h-5 w-5 transition-transform ${expandedSectionId === section.id ? 'transform rotate-90' : ''}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {expandedSectionId === section.id && (
                                        <div className="mt-2 space-y-2 pt-2 px-2">
                                            {section.todos.map((todo: Todo, todoIndex) => (
                                                <div key={todo.id} className={`flex items-center justify-between ${todoIndex !== section.todos.length - 1 ? 'border-b border-slate-400 pb-2' : ''}`}>
                                                    <div className="flex items-center">
                                                        <CheckboxPrimitive.Root
                                                            className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"
                                                            checked={todo.completed}
                                                            onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                                                            id={`todo-${todo.id}`}
                                                        >
                                                            <CheckboxPrimitive.Indicator>
                                                                <div className="w-4 h-4 rounded-full bg-yellow" />
                                                            </CheckboxPrimitive.Indicator>
                                                        </CheckboxPrimitive.Root>
                                                        <label
                                                            htmlFor={`todo-${todo.id}`}
                                                            className={`ml-3 cursor-pointer ${todo.completed ? 'line-through text-slate-300' : ''}`}
                                                        >
                                                            {todo.text}
                                                        </label>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                                                        <Trash2 className="h-4 w-4 text-slate-300" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {showNewTodoInput === section.id ? (
                                                <div className="flex mt-2">
                                                    <input
                                                        type="text"
                                                        value={newTodoText}
                                                        onChange={(e) => setNewTodoText(e.target.value)}
                                                        placeholder={t('newTodoPlaceholder')}
                                                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow mr-2"
                                                        onKeyPress={(e) => e.key === 'Enter' && addTodo(section.id)}
                                                    />
                                                    <Button onClick={() =>{ 
                                                        addTodo(section.id);
                                                        setShowNewTodoInput(null)
                                                    }} variant={'default'}>
                                                        <Translate namespace="Blogger" itemKey="add" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button 
                                                    variant="ghost" 
                                                    className="text-left w-full" 
                                                    onClick={() => {
                                                        setShowNewTodoInput(section.id)
                                                    }}
                                                >
                                                    <PlusCircle className="h-6 w-6 mr-2 text-slate-300" />
                                                    <Translate namespace="Blogger" itemKey="add" />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>


                    <section className="border border-gray-300 rounded-lg md:col-span-2">
                        <SectionHeader 
                            icon={Wallet} 
                            title={<Translate namespace="Blogger" itemKey="profit" />}
                            link="/blogger/billing"
                            showChevron={true}
                            locale={locale}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-5 p-4 gap-4">
                            <div className="bg-white p-4 border border-gray-300 rounded-lg sm:col-span-3">
                                <p className="font-bold mb-2 text-[20px] leading-[24px]"><Translate namespace="Blogger" itemKey="balance" />:</p>
                                <p className='font-bold text-[20px] leading-[24px]'>{user?.bloggerBalance} ₴</p>
                                <div className='flex flex-col sm:flex-row gap-2 mt-4'>
                                    <Button variant="default" className="w-full">
                                        <Link href={`/${locale}/blogger/billing`}>
                                            <p className="font-bold text-[18px] leading-[21px]"><Translate namespace="Blogger" itemKey="widthraw" /></p>
                                        </Link>
                                    </Button>
                                    <TransferMoneyModal>
                        <Button variant='outline' className='w-full'>
                            <p className='text-[18px] leading-[21px]'><Translate namespace='Advertiser' itemKey='transfer' /></p>

                        </Button>
                    </TransferMoneyModal>
                                </div>
                            </div>
                            <div className="bg-white p-4 border border-gray-300 rounded-lg sm:col-span-2">
                                <h3 className="font-bold text-[20px] leading-[24px] flex mb-2"><Translate namespace="Blogger" itemKey="hold" />:</h3>
                                <p className="font-bold text-[20px] leading-[24px]">{user?.bloggerHoldBalance} ₴</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default Dashboard
