import { type StatisticCategory } from "@/database/blogger/statistic";


export function computeStatisticCategory(category: StatisticCategory, newValue: Maybe<number>): StatisticCategory {
    if (!newValue) return category

    const dayAgoStatistic = category.slice(-1)[0];
    const weekAgoStatistic = category.slice(-7)[0];
    const monthAgoStatistic = category.slice(-30)[0];



    const dayIncrease = getIncrease(dayAgoStatistic?.value ?? newValue, newValue)
    const weekIncrease = getIncrease(weekAgoStatistic?.value ?? newValue, newValue)
    const monthIncrease = getIncrease(monthAgoStatistic?.value ?? newValue, newValue)

    const current = {
        daily: {
            increase: dayIncrease?.increase ?? null,
            increasePercentage: dayIncrease?.increasePercentage ?? null,
        },
        weekly: {
            increase: weekIncrease?.increase ?? null,
            increasePercentage: weekIncrease?.increasePercentage ?? null,
        },
        monthly: {
            increase: monthIncrease?.increase ?? null,
            increasePercentage: monthIncrease?.increasePercentage ?? null,
        }
    }

    return [
        ...category,
        {
            ...current,
            value: newValue,
            timestamp: Date.now().toString()
        }
    ]

}

function getIncrease(lastValue: number, currentValue: number): { increase: number, increasePercentage: number } {
    const increase = currentValue - lastValue;
    const increasePercentage = Number((currentValue * 100 / lastValue).toFixed(0)) - 100;

    return {
        increase,
        increasePercentage
    }
}