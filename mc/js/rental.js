document.addEventListener('DOMContentLoaded', function() {
    const plotRentalList = document.getElementById('plot-rental-list');
    const signRentalList = document.getElementById('sign-rental-list');

    // Função para converter valores como "1.5T", "20B", etc., em números inteiros
    function parseMoneyValue(value) {
        if (typeof value === 'number') return value; // Já é um número
        if (typeof value !== 'string') return 0; // Valor inválido

        const suffix = value.slice(-1).toUpperCase(); // Último caractere (T, B, M, K, c, etc.)
        const numberPart = parseFloat(value.slice(0, -1)); // Parte numérica

        switch (suffix) {
            case 'T': // Trilhões
                return numberPart * 1000000000000;
            case 'B': // Bilhões
                return numberPart * 1000000000;
            case 'M': // Milhões
                return numberPart * 1000000;
            case 'K': // Milhares
                return numberPart * 1000;
            case 'C': // coins
                return numberPart;
            default: // Sem sufixo (valor em coins)
                return parseFloat(value) || 0;
        }
    }

    // Função para formatar o valor do money
    function formatMoney(value) {
        if (value >= 1000000000000) { // Trilhões
            const trillions = value / 1000000000000;
            return `${trillions % 1 === 0 ? trillions.toFixed(0) : trillions.toFixed(1)}T`;
        } else if (value >= 1000000000) { // Bilhões
            const billions = value / 1000000000;
            return `${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)}B`;
        } else if (value >= 1000000) { // Milhões
            const millions = value / 1000000;
            return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
        } else if (value >= 1000) { // Milhares
            const thousands = value / 1000;
            return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
        } else { // coins
            return `${value}c`;
        }
    }

    // Função para calcular o tempo de renovação
    function calculateRenewalTime(rentalDuration, rentalType) {
        if (rentalType === "permanente") return null; // Não há renovação para permanente

        const durationInSeconds = rentalType === "semanal" ? 7 * 24 * 60 * 60 : 30 * 24 * 60 * 60; // Semanal ou mensal em segundos
        return rentalDuration + durationInSeconds; // Adiciona ao tempo contratado
    }

    // Função para calcular quantos dias faltam para a renovação expirar
    function calculateDaysRemaining(renewalTime) {
        const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em timestamp
        const timeDifference = renewalTime - currentTime; // Diferença em segundos
        const daysRemaining = Math.floor(timeDifference / (24 * 60 * 60)); // Converte para dias
        return daysRemaining;
    }

    function createMinecraftText(text) {
        return parseMCString(text + "§f"); // Reset para branco no final
    }
    
    function createHammertimeButton(timestamp) {
        const button = document.createElement('button');
        button.className = 'minecraft-button';
        button.innerHTML = 'Ver Tempo';
        button.onclick = () => window.open(`https://hammertime.cyou/pt-BR?t=${timestamp}`, '_blank');
        return button;
    }
    
    function displayRentals(listElement, rentals) {
        const currentTime = Math.floor(Date.now() / 1000);
        listElement.innerHTML = '';
    
        rentals.forEach(rental => {
            const rentalItem = document.createElement('div');
            rentalItem.className = 'rental-item';
    
            // Processa textos com cores do Minecraft
            const formattedPlot = createMinecraftText(rental.plot);
            const formattedLocator = createMinecraftText(rental.locatorName);
            const formattedMoney = formatMoney(parseMoneyValue(rental.rentalValue));
            const rentalDate = new Date(rental.rentalDuration * 1000).toLocaleString();
    
            rentalItem.innerHTML = `
                <div class="minecraft-text">
                    ${formattedPlot}
                </div>
                <br>
                <div class="minecraft-text"></div>
                <p><strong>Locatário:</strong> ${formattedLocator}</p>
                <p><strong>Valor:</strong> ${formattedMoney}</p>
                <p><strong>Contratado em:</strong> ${rentalDate}</p>
            `;
    
            // Botão Hammertime e status de renovação
            if (rental.rentalType !== "permanente") {
                const renewalTime = calculateRenewalTime(rental.rentalDuration, rental.rentalType);
                const renewalDate = new Date(renewalTime * 1000).toLocaleString();
                
                // Botão
                rentalItem.appendChild(createHammertimeButton(rental.rentalDuration));
    
                // Status
                const statusDiv = document.createElement('div');
                statusDiv.className = 'status-box';
                
                const daysRemaining = calculateDaysRemaining(renewalTime);
                statusDiv.innerHTML = currentTime > renewalTime ? 
                    '<span class="mc-red">EXPIRADO</span>' : 
                    `<span class="mc-green">${daysRemaining} dias restantes</span>`;
                
                rentalItem.appendChild(statusDiv);
            }
    
            listElement.appendChild(rentalItem);
        });
    }

    // Exibe os aluguéis de plots e placas
    displayRentals(plotRentalList, plotRentals);
    displayRentals(signRentalList, signRentals);
});