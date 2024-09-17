// import NestedList from '@/components/ui/custom/nested-list'
// import { dataList } from './_constants/data-list'
import Translate from '@/components/Translate'
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const infoPrivacyPolicyT = await getTranslations('Info.Privacy-Policy');

    return {
        title: "UATRAFFIC | " + infoPrivacyPolicyT('meta/title'),
        description: infoPrivacyPolicyT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + infoPrivacyPolicyT('meta/title'),
            description: infoPrivacyPolicyT('meta/description'),
        },
    }
}

const PrivacyPolicyPage = () => {
    return (
        <div className='container pt-5 pb-10 select-text'>
            <div className='mb-5'>
                <h1 className='text-lg font-title'>
                    <Translate namespace='Info.Privacy-Policy' itemKey='title' />
                </h1>

                <h2 className='text-sm text-main/50'>
                    <Translate namespace='Info.Privacy-Policy' itemKey='description' />
                </h2>
            </div>

            {/* <NestedList list={dataList} /> */}
            <div>
                <h3 className="mb-2 font-bold">1. Загальні положення</h3>

                <p className="mb-1">Адміністрація обробки персональних даних у рамках здійснення обробки персональних даних є «UATRAFFIC» - https://uatraffic.com</p>

                <p className="mb-1">Адміністрація Сервісу ставить своєю найважливішою метою та умовою здійснення своєї діяльності дотримання прав і свобод людини та громадянина при обробці його персональних даних, у тому числі захисту прав на недоторканність приватного життя, особисту та сімейну таємницю.</p>

                <p className="mb-2">Політика персональних даних  застосовується до всієї інформації, яку Адміністрація або Оператор може отримати про відвідувачів веб-сайту https://uatraffic.com</p>

                <h3 className="mb-2 font-bold">2. Основні поняття, що використовуються у Політиці</h3>
                <p className="mb-1">Автоматизована обробка персональних даних – обробка персональних даних за допомогою обчислювальної техніки;</p>

                <p className="mb-1">Блокування персональних даних – тимчасове припинення обробки персональних даних (крім випадків, якщо обробка необхідна уточнення персональних даних);</p>

                <p className="mb-1">Веб-сайт – сукупність графічних та інформаційних матеріалів, а також програм для ЕОМ та баз даних, що забезпечують їх доступність у мережі інтернет за мережевою адресою https://uatraffic.com</p>

                <p className="mb-1">Інформаційна система персональних даних - сукупність персональних даних, що містяться в базах даних, і забезпечують їх обробку інформаційних технологій і технічних засобів;</p>

                <p className="mb-1">«Конфіденційність персональних даних» — обов'язкова для дотримання Оператором або іншою особою, яка отримала доступ до персональних даних, вимога не допускати їх розповсюдження без згоди суб'єкта персональних даних або наявності іншої законної підстави;</p>

                <p className="mb-1">Знеособлення персональних даних — дії, у яких неможливо визначити без використання додаткової інформації належність персональних даних конкретному Користувачеві чи іншому суб'єкту персональних даних;</p>

                <p className="mb-1">Обробка персональних даних – будь-яка дія (операція) або сукупність дій (операцій), що здійснюються з використанням засобів автоматизації або без використання таких засобів з персональними даними, включаючи збирання, запис, систематизацію, накопичення, зберігання, уточнення (оновлення, зміну), вилучення, використання, передачу (поширення, надання, доступ), знеособлення, блокування, видалення, знищення персональних даних;</p>

                <p className="mb-1">Адміністрація або Оператор – державний орган, муніципальний орган, юридична або фізична особа, які самостійно або спільно з іншими особами організовують та (або) здійснюють обробку персональних даних, а також визначають цілі обробки персональних даних, склад персональних даних, що підлягають обробці, дії (операції), що здійснюються із персональними даними;</p>

                <p className="mb-1">Персональні дані – будь-яка інформація, що стосується прямо або опосередковано до певного або визначеного користувача веб-сайту https://uatraffic.com</p>

                <p className="mb-1">Користувач – будь-який відвідувач веб-сайту https://uatraffic.com;</p>
                <p className="mb-1">Надання персональних даних – дії, створені задля розкриття персональних даних певному особі чи певному колу осіб;</p>

                <p className="mb-1">Поширення персональних даних – будь-які дії, спрямовані на розкриття персональних даних невизначеному колу осіб (передача персональних даних) або на ознайомлення з персональними даними необмеженого кола осіб, у тому числі оприлюднення персональних даних у засобах масової інформації, розміщення в інформаційно-телекомунікаційних мережах або надання доступу до персональних даних будь-яким іншим способом;</p>

                <p className="mb-1">Транскордонна передача персональних даних – передача персональних даних на територію іноземної держави до органу влади іноземної держави, іноземної фізичної чи іноземної юридичної особи;</p>

                <p className="mb-2">Знищення персональних даних – будь-які дії, внаслідок яких персональні дані знищуються безповоротно з неможливістю подальшого відновлення змісту персональних даних в інформаційній системі персональних даних та (або) внаслідок яких знищуються матеріальні носії персональних даних.</p>

                <h3 className="mb-2 font-bold">3. Оператор може обробляти такі персональні дані Користувача</h3>
                <p className="mb-1">• Електронна адреса;</p>
                <p className="mb-1">• Номер телефону;</p>

                <p className="mb-1">Також на сайті відбувається збір та обробка знеособлених даних про відвідувачів (в т.ч. файлів cookie) за допомогою сервісів інтернет-статистики (Google Аналітика та інших).</p>

                <p className="mb-2">Дані за текстом Політики об'єднані загальним поняттям Персональні дані.</p>

                <h3 className="mb-2 font-bold">4. Цілі обробки персональних даних</h3>
                <p className="mb-1">Мета обробки персональних даних Користувача - поширення рекламної інформації за допомогою розсилки інформаційних повідомлень.</p>

                <p className="mb-1">Також Оператор має право надсилати Користувачеві повідомлення про нові продукти та послуги, спеціальні пропозиції та різні події. Користувач завжди може відмовитися від отримання інформаційних повідомлень, надіславши Оператору листа на адресу електронної пошти support@uatraffic.com з позначкою «Відмова від повідомлень про нові продукти та послуги та спеціальні пропозиції».</p>

                <p className="mb-2">Знеособлені дані Користувачів, які збираються за допомогою сервісів інтернет-статистики, служать для збору інформації про дії Користувачів на сайті, покращення якості сайту та його змісту.</p>

                <h3 className="mb-2 font-bold">5. Правові основи обробки персональних даних</h3>
                <p className="mb-1">Оператор обробляє персональні дані Користувача лише у разі їх заповнення та/або відправлення Користувачем самостійно через спеціальні форми, розміщені на сайті https://uatraffic.com. Заповнюючи відповідні форми та/або надсилаючи свої персональні дані Оператору, Користувач висловлює свою згоду з цією Політикою.</p>

                <p className="mb-2">Оператор обробляє знеособлені дані про Користувача у випадку, якщо це дозволено у налаштуваннях браузера Користувача (включено збереження файлів cookie та використання технології JavaScript).</p>

                <h3 className="mb-2 font-bold">6. Порядок збирання, зберігання, передачі та інших видів обробки персональних даних</h3>
                <p className="mb-1">Безпека персональних даних, що обробляються Оператором, забезпечується шляхом реалізації правових, організаційних та технічних заходів, необхідних для виконання у повному обсязі вимог чинного законодавства у сфері захисту персональних даних.</p>

                <p className="mb-1">Оператор забезпечує збереження персональних даних та вживає всіх можливих заходів, що виключають доступ до персональних даних неуповноважених осіб.</p>

                <p className="mb-1">Персональні дані Користувача можуть бути надані третім особам, якщо це передбачено чинним законодавством (податкові, правоохоронні органи та ін.) та/або цією Політикою лише за згодою Користувача, яка виражається відповідно до розділу 5 цієї Політики.</p>

                <p className="mb-1">У рамках цієї Політики третіми особами визнаються ділові партнери та постачальники послуг, з якими UATRAFFIC має договірні відносини в рамках надання доступу до Веб-сайту та відповідних послуг.</p>

                <p className="mb-1">UATRAFFIC зобов'язується надати список третіх осіб, яким були надані персональні дані Користувача, на письмовий запит Користувача на електронну адресу Оператора support@uatraffic.com</p>

                <p className="mb-1">У разі виявлення неточностей у персональних даних, Користувач може актуалізувати їх самостійно шляхом надсилання Оператору повідомлення на адресу електронної пошти Оператора support@uatraffic.com з позначкою «Актуалізація персональних даних».</p>

                <p className="mb-2">Термін обробки персональних даних є необмеженим. Користувач може в будь-який момент відкликати свою згоду на обробку персональних даних, надіславши Оператору повідомлення через електронну пошту на електронну адресу Оператора support@uatraffic.com з позначкою «Відгук згоди на обробку персональних даних».</p>

                <h3 className="mb-2 font-bold">7. Транскордонна передача персональних даних</h3>
                <p className="mb-1">Оператор на початок здійснення транскордонної передачі персональних даних зобов'язаний переконатися у цьому, що іноземним державою, територію якого передбачається здійснювати передачу персональних даних, забезпечується надійний захист прав суб'єктів персональних даних.</p>

                <p className="mb-2">Транскордонна передача персональних даних на території іноземних держав, які не відповідають вищевказаним вимогам, може здійснюватися лише у разі наявності згоди у письмовій формі суб'єкта персональних даних на транскордонну передачу його персональних даних та/або виконання договору, стороною якого є суб'єкт персональних даних.</p>

                <h3 className="mb-2 font-bold">8. Співвідношення Політики та Загального регламенту ЄС щодо захисту персональних даних</h3>
                <p className="mb-1">Ця Політика обробки персональних даних складена також відповідно до вимог Загального регламенту ЄС щодо захисту персональних даних (General Data Protection Regulation – GDPR).</p>

                <p className="mb-1">«UATRAFFIC» не виступає ні оператором, ні контролером даних згідно з визначенням GDPR і не несе відповідальності як контролера та/або оператора даних за регламентом GDPR, оскільки не здійснює збір та процесинг персональних даних Суб'єктів персональних даних та не визначає їх використання та мету.</p>

                <p className="mb-1">https://uatraffic.com виступає оператором та контролером даних за регламентом GDPR та несе відповідну відповідальність.
                Додаткові права для Європейської економічної зони та деяких інших територій:
                - право на запит копії даних Користувача, які зберігаються.</p>

                <p className="mb-1">Якщо Користувач висловлює бажання отримати копію частини або всіх персональних даних, які зберігаються, йому необхідно надіслати листа за допомогою електронної пошти support@uatraffic.com
                - право опротестувати обробку персональних даних.
                - право отримання персональних даних у структурованому, широко використовуваному та машинно-читаному форматі
                - право організувати передачу даних від поточного контролера іншому контролеру за умови, що:
                а) обробка здійснюється на підставі згоди або договору, та
                б) обробка здійснюється засобами автоматизації.</p>

                <p className="mb-1">Щоб реалізувати це право, необхідно надіслати листа за допомогою електронної пошти support@uatraffic.com
                - право на забуття.</p>

                <p className="mb-2">Для повного видалення всіх даних Користувача необхідно надіслати листа за допомогою електронної пошти support@uatraffic.com
                - право направлення скарги до органу захисту даних на збір та використання Оператором персональних даних Користувача.</p>

                <h3 className="mb-2 font-bold">9. Забезпечення безпеки та конфіденційності персональних даних</h3>
                <p className="mb-1">Безпека і конфіденційність персональних даних, оброблюваних Оператором, забезпечується реалізацією правових, організаційних і технічних заходів, необхідні забезпечення вимог федерального законодавства у сфері захисту персональних даних.</p>

                <p className="mb-2">Для запобігання несанкціонованому доступу до персональних даних Оператором застосовуються такі організаційно-технічні заходи:
                призначення посадових осіб, відповідальних за організацію обробки та захисту персональних даних; обмеження складу осіб, допущених до опрацювання персональних даних; ознайомлення суб'єктів з вимогами федерального законодавства та нормативних документів Оператора з обробки та захисту персональних даних; організація обліку, зберігання та обігу носіїв, що містять інформацію з персональними даними; визначення загроз безпеці персональних даних під час їх обробки, формування на їх основі моделей загроз; розробка з урахуванням моделі загроз системи захисту персональних даних; перевірка готовності та ефективності використання засобів захисту інформації; розмежування доступу користувачів до інформаційних ресурсів та програмно-апаратних засобів обробки інформації; реєстрація та облік дій користувачів інформаційних систем персональних даних; використання антивірусних засобів та засобів відновлення системи захисту персональних даних; застосування у необхідних випадках засобів між-мережевого екранування, виявлення вторгнень, аналізу захищеності та засобів криптографічного захисту інформації; організація пропускного режиму на територію Оператора, охорони приміщень із технічними засобами обробки персональних даних.</p>

                <h3 className="mb-2 font-bold">10. Заключні положення</h3>
                <p className="mb-1">«UATRAFFIC» має право вносити зміни до цієї Політики обробки персональних даних без згоди Користувача.</p>

                <p className="mb-1">Користувач може отримати будь-які роз'яснення стосовно питань, що цікавлять обробку його персональних даних, звернувшись до Оператора за допомогою електронної пошти support@uatraffic.com</p>

                <p className="mb-1">У цьому документі буде відображено будь-які зміни політики обробки персональних даних Оператором. Політика діє безстроково до заміни її новою версією.</p>
            </div>
        </div>
    )
}

export default PrivacyPolicyPage