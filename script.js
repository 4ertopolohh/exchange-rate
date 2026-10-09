
const ratesBlock = document.querySelector("#rates");
const form = document.querySelector("#form");
const currencyInput = document.querySelector("#currency");
const result = document.querySelector("#result");

let valutes = null;

async function loadRates() {
    try {
        const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");

        if (!response.ok) {
            throw new Error("Ошибка запроса");
        }

        const data = await response.json();

        valutes = data.Valute;

        const codes = ["USD", "EUR", "CNY"];

        for (let i = 0; i < codes.length; i++) {
            const currency = valutes[codes[i]];

            const rate = currency.Value / currency.Nominal;
            const previousRate = currency.Previous / currency.Nominal;

            const p = document.createElement("p");

            p.textContent = currency.Name + " (" + currency.CharCode + "): " + rate.toFixed(2) + " руб.";

            const arrow = document.createElement("span");

            if (rate > previousRate) {
                arrow.innerHTML = ' <img src="up.png">';
                arrow.style.color = "green";
            } else if (rate < previousRate) {
                arrow.innerHTML = ' <img src="down.png">';
                arrow.style.color = "red";
            } else {
                arrow.innerHTML = ' <img src="straight.png">';
            }

            p.append(arrow);
            ratesBlock.append(p);
        }

    } catch (error) {
        ratesBlock.textContent = "Не удалось загрузить курсы валют";
    }
}

loadRates();

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (valutes === null) {
        result.textContent = "Данные о курсах не загружены";
        return;
    }

    const name = currencyInput.value.trim().toLowerCase();

    if (name === "") {
        result.textContent = "Введите название валюты";
        return;
    }

    let foundCurrency = null;

    for (let code in valutes) {
        if (code.toLowerCase() === name || valutes[code].Name.toLowerCase() === name) {
            foundCurrency = valutes[code];
            break;
        }
    }

    if (foundCurrency === null) {
        result.textContent = "Валюта не найдена";
    } else {
        const rate = foundCurrency.Value / foundCurrency.Nominal;

        result.textContent = "1 " + foundCurrency.Name + " = " + rate.toFixed(4) + " руб.";
    }
});
