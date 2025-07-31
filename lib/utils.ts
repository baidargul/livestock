import { Animal } from "@prisma/client";

export function formalizeText(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatCurrency(amount: number, ignoreSymbol?: boolean) {
  const formattedNumber = new Intl.NumberFormat("en-US").format(amount);
  if (!ignoreSymbol) {
    return `Rs ${formattedNumber}`;
  } else {
    return `${formattedNumber}`;
  }
}

export function calculatePricing(animal: Animal) {
  const quantity =
    Number(animal.maleQuantityAvailable || 0) +
    Number(animal.femaleQuantityAvailable || 0);

  const price = Number(animal.price || 0);
  const priceUnit = String(animal.priceUnit).toLowerCase();
  const weightUnit = String(animal.weightUnit).toLowerCase();
  const avgWeight = Number(animal.averageWeight || 0);

  let priceString = "";
  let totalPrice = 0;

  if (priceUnit === `per ${weightUnit}`) {
    const totalWeight = avgWeight * quantity;
    totalPrice = price * totalWeight;
    priceString = `${quantity} ${formalizeText(
      animal.type
    )} (${totalWeight}${weightUnit}) · ${formatCurrency(totalPrice)}`;
  } else if (priceUnit === "per set") {
    totalPrice = price;
    priceString = `${quantity} set${
      quantity !== 1 ? "s" : ""
    } · ${formatCurrency(totalPrice)}`;
  } else if (priceUnit === "per piece") {
    totalPrice = price * quantity;
    priceString = `${quantity} piece${
      quantity !== 1 ? "s" : ""
    } · ${formatCurrency(totalPrice)}`;
  } else {
    totalPrice = price;
    priceString = `Fixed price · ${formatCurrency(totalPrice)}`;
  }

  return {
    price: Math.round(totalPrice * 100) / 100, // Ensure 2 decimal places
    text: priceString,
    unit: priceUnit,
  };
}

export function convertCurrencyToWords(
  amount: number,
  translate: boolean = false
): string {
  // Validate input
  if (isNaN(amount)) return translate ? "غلط رقم" : "Invalid Amount";
  if (amount === 0) return translate ? "صفر روپے" : "Zero Rupees";

  // Helper functions
  const getUnit = (num: number, unit: string): string => {
    const units: { [key: string]: { en: string[]; ur: string[] } } = {
      arab: {
        en: ["Arab", "Arabs"],
        ur: ["ارب", "ارب"],
      },
      crore: {
        en: ["Crore", "Crores"],
        ur: ["کروڑ", "کروڑ"],
      },
      lac: {
        en: ["Lac", "Lacs"],
        ur: ["لاکھ", "لاکھ"],
      },
      thousand: {
        en: ["Thousand", "Thousands"],
        ur: ["ہزار", "ہزار"],
      },
    };

    const index = num === 1 ? 0 : 1;
    return translate ? units[unit].ur[index] : units[unit].en[index];
  };

  const convertBelowHundred = (num: number): string => {
    const units = translate
      ? ["", "ایک", "دو", "تین", "چار", "پانچ", "چھ", "سات", "آٹھ", "نو"]
      : [
          "",
          "One",
          "Two",
          "Three",
          "Four",
          "Five",
          "Six",
          "Seven",
          "Eight",
          "Nine",
        ];

    const teens = translate
      ? [
          "دس",
          "گیارہ",
          "بارہ",
          "تیرہ",
          "چودہ",
          "پندرہ",
          "سولہ",
          "سترہ",
          "اٹھارہ",
          "انیس",
        ]
      : [
          "Ten",
          "Eleven",
          "Twelve",
          "Thirteen",
          "Fourteen",
          "Fifteen",
          "Sixteen",
          "Seventeen",
          "Eighteen",
          "Nineteen",
        ];

    const tens = translate
      ? ["", "دس", "بیس", "تیس", "چالیس", "پچاس", "ساٹھ", "ستر", "اسی", "نوے"]
      : [
          "",
          "Ten",
          "Twenty",
          "Thirty",
          "Forty",
          "Fifty",
          "Sixty",
          "Seventy",
          "Eighty",
          "Ninety",
        ];

    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    return (
      tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "")
    );
  };

  const convertBelowThousand = (num: number): string => {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    let res = "";
    if (hundred > 0) {
      res += translate
        ? `${convertBelowHundred(hundred)} سو `
        : `${convertBelowHundred(hundred)} Hundred `;
    }
    if (remainder > 0) {
      res += convertBelowHundred(remainder);
    }
    return res.trim();
  };

  // Break down the amount into denominations
  const breakdown = {
    kharab: Math.floor(amount / 100000000000),
    arab: Math.floor((amount % 100000000000) / 1000000000),
    crore: Math.floor((amount % 1000000000) / 10000000),
    lac: Math.floor((amount % 10000000) / 100000),
    thousand: Math.floor((amount % 100000) / 1000),
    hundred: Math.floor((amount % 1000) / 100),
    tensAndOnes: amount % 100,
  };

  // Build parts array
  const parts: string[] = [];

  // Kharab (1000 Crore/10 Billion)
  if (breakdown.kharab > 0) {
    parts.push(
      translate
        ? `${convertBelowHundred(breakdown.kharab)} کھرب`
        : `${convertBelowHundred(breakdown.kharab)} Kharab`
    );
  }

  // Arab (100 Crore/1 Billion)
  if (breakdown.arab > 0) {
    parts.push(
      translate
        ? `${convertBelowHundred(breakdown.arab)} ارب`
        : `${convertBelowHundred(breakdown.arab)} Arab`
    );
  }

  // Crore (10 Million)
  if (breakdown.crore > 0) {
    parts.push(
      translate
        ? `${convertBelowHundred(breakdown.crore)} کروڑ`
        : `${convertBelowHundred(breakdown.crore)} ${getUnit(
            breakdown.crore,
            "crore"
          )}`
    );
  }

  // Lac (100 Thousand)
  if (breakdown.lac > 0) {
    parts.push(
      translate
        ? `${convertBelowHundred(breakdown.lac)} لاکھ`
        : `${convertBelowHundred(breakdown.lac)} ${getUnit(
            breakdown.lac,
            "lac"
          )}`
    );
  }

  // Thousand
  if (breakdown.thousand > 0) {
    parts.push(
      translate
        ? `${convertBelowThousand(breakdown.thousand)} ہزار`
        : `${convertBelowThousand(breakdown.thousand)} ${getUnit(
            breakdown.thousand,
            "thousand"
          )}`
    );
  }

  // Hundreds and below
  if (breakdown.hundred > 0 || breakdown.tensAndOnes > 0) {
    const remainder = breakdown.hundred * 100 + breakdown.tensAndOnes;
    parts.push(convertBelowThousand(remainder));
  }

  // Join parts with proper conjunctions
  let result = "";
  if (parts.length > 1) {
    const last = parts.pop();
    const conjunction = translate ? " اور " : " and ";
    result = parts.join(translate ? "، " : ", ") + conjunction + last;
  } else {
    result = parts[0];
  }

  // Add currency unit and RTL formatting
  const currency = translate ? " روپے" : " Rupees";
  const formattedResult = translate
    ? `\u202B${result}${currency}\u202C` // RTL embedding
    : `${result}${currency}`;

  return formattedResult
    .replace(/\s+/g, " ")
    .replace(/(\D) (\d)/g, "$1$2") // Fix spacing before numbers
    .trim();
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    ...options,
  });
}

export function TrimString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength - 3) + "...";
  }
  return str;
}

type elapsedTimeType = string | { key: string; val: number };

export function elapsedTime(dateTimeString: string): string;
export function elapsedTime(
  dateTimeString: string,
  options: { obj: true }
): { key: string; val: number };
export function elapsedTime(
  dateTimeString: string,
  options?: { obj?: boolean }
): string | { key: string; val: number } {
  const now = Date.now();
  const then = new Date(dateTimeString).getTime();
  const elapsed = now - then;

  const intervals = [
    { unit: "year", factor: 31536000000 },
    { unit: "month", factor: 2628000000 },
    { unit: "day", factor: 86400000 },
    { unit: "hour", factor: 3600000 },
    { unit: "minute", factor: 60000 },
    { unit: "second", factor: 1000 },
  ];

  for (const { unit, factor } of intervals) {
    const value = Math.floor(elapsed / factor);
    if (value > 0) {
      return options?.obj
        ? { key: unit, val: value }
        : `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
  }

  return options?.obj ? { key: "second", val: 0 } : "Just now";
}
