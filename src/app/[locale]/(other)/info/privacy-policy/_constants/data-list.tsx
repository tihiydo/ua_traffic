import { type NestedListType } from "@/components/ui/custom/nested-list";

export const dataList: NestedListType = {
    items: [
        {
            text: 'Загальні положення',
            list: {
                items: [{
                    text: 'Ця політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо інформацію, яку ви надаєте під час використання Instagram Basic Display у режимі розробки.'
                }]
            }
        },
        {
            text: 'Збір та використання інформації',
            list: {
                items: [
                    {
                        text: 'Збір даних:',
                        list: {
                            items: [
                                {
                                    text: `Ми збираємо обмежений обсяг інформації, необхідної для ефективного використання Instagram Basic Display у режимі розробки. Це може включати, але не обмежується, [перелік даних, наприклад: ім'я користувача, ідентифікатори, IP-адреси тощо].`
                                },
                                {
                                    text: `Збір цих даних може відбуватися автоматично або за вашою згодою під час використання сервісу.`
                                }
                            ]
                        }
                    },
                    {
                        text: 'Використання даних:',
                        list: {
                            items: [
                                {
                                    text: 'Зібрана інформація використовується виключно для реалізації функціоналу Instagram Basic Display у режимі розробки.'
                                },
                                {
                                    text: 'Ми не використовуємо ці дані для будь-яких інших цілей, в тому числі рекламних чи маркетингових, без вашої явної згоди.'
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            text: 'Захист особистої інформації',
            list: {
                items: [
                    {
                        text: 'Заходи безпеки:',
                        list: {
                            items: [
                                {
                                    text: `Ми вживаємо належних заходів для захисту вашої особистої інформації від несанкціонованого доступу, втрати, розголошення чи зміни.`
                                },
                                {
                                    text: `Тільки авторизовані працівники, підприємства чи агенти, які потребують ці дані для виконання конкретних завдань, мають до них доступ.`
                                }
                            ]
                        }
                    },
                ]
            }
        },
        {
            text: `Зміни в політиці конфіденційності`,
            list: {
                items: [
                    {
                        text: `Оновлення політики:`,
                        list: {
                            items: [
                                {
                                    text: `Ця політика конфіденційності може час від часу змінюватися. Будь ласка, періодично переглядайте її, щоб бути в курсі всіх змін.`
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            text: `Зв'язок з нами`,
            list: {
                items: [
                    {
                        text: 'Якщо у вас є питання чи зауваження щодо цієї політики конфіденційності, звертайтеся за адресою [ваша контактна інформація]'
                    }
                ]
            }
        }
    ]
}