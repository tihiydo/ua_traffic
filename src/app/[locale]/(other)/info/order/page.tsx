import Translate from "@/components/Translate";
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const infoOrderT = await getTranslations("Info.Order");

  return {
    title: "UATRAFFIC | " + infoOrderT("meta/title"),
    description: infoOrderT("meta/description"),
    openGraph: {
      title: "UATRAFFIC | " + infoOrderT("meta/title"),
      description: infoOrderT("meta/description"),
    },
  };
}

const OrderPostInfoPage = async () => {
  const t = await getTranslations("Info.Order");

  return (
    <div className="container pb-10 pt-5 select-text">
      <div className="mb-5">
        <h1 className="font-title text-lg">
          <Translate namespace="Info.Order" itemKey="title" />
        </h1>
        <p className="text-sm text-main/50">
          {/* <Translate namespace="Info.Order" itemKey="description" /> */}
        </p>
      </div>

      <div>
        <h3 className="mb-2 font-bold">1. Реєстрація на сайті: </h3>
        <p className="mb-2"> Для початку Рекламодавці та Блогери мають зареєструватися на платформі для доступу до всіх її функцій.</p> 
        <h3 className="mb-2 font-bold">2. Створення профілю: </h3>
        <p className="mb-2">Після реєстрації створіть свій профіль, де вкажіть інформацію про компанію, цільову аудиторію та продукт. </p>
        <h3 className="mb-2 font-bold">3. Пошук блогера: </h3>
        <p className="mb-2">Використовуйте пошук на сайті для знаходження відповідних блогерів з урахуванням параметрів вашої кампанії, таких як тематика блогу, географія аудиторії та розмір аудиторії блогера. </p>
        <h3 className="mb-2 font-bold">4. Вибір блогера:</h3> 
        <p className="mb-2">Рекламодавець обирає підходящого блогера, оцінює деталі рекламної кампанії, такі як ціна, тип розміщення, тип поста, терміни розміщення та вимоги до контенту. </p>
        <h3 className="mb-2 font-bold">5. Угода та оплата: </h3>
        <p className="mb-2">Коли рекламодавець обрав необхідні параметри та натиснув "Замовити пост", його заявка автоматично надсилається блогеру. Після цього блогер підтверджує замовлення, і воно переходить на модерацію. </p>
        <h3 className="mb-2 font-bold">6. Розміщення реклами:</h3>
        <p className="mb-2">Рекламодавець відстежує результати кампанії, такі як кількість переглядів, кліків та інші метрики.</p>
        <h3 className="mb-2 font-bold">7. Холд: </h3>
        <p className="mb-2">Після того, як ви замовили пост, ваші гроші переходять у холд, до моменту поки заявка не пройде модерацію. </p>
        <h3 className="mb-2 font-bold">8. Зворотній зв'язок та оцінка: </h3>
        <p className="mb-2">Під час угоди та після завершення рекламної кампанії рекламодавець та блогер можуть обмінятися зворотним зв'язком за допомогою чату прямо на сайті.</p>
      </div>
    </div>
  );
};

export default OrderPostInfoPage;
