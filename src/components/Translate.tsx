import { type TranslationValues, useTranslations } from "next-intl";
type Props = {
  namespace: string;
  itemKey: string;
  values?: TranslationValues
};

const Translate = ({ namespace, itemKey, values: args }: Props) => {
    const t = useTranslations(namespace);
    return t(itemKey, args);
};

export default Translate;