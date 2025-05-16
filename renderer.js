function numberToWordsIN(n) {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
               "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", 
               "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const numToWords = (num) => {
        if (num < 20) return a[num];
        if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
        if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + numToWords(num % 100) : "");
        if (num < 100000) return numToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numToWords(num % 1000) : "");
        if (num < 10000000) return numToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numToWords(num % 100000) : "");
        return numToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numToWords(num % 10000000) : "");
    };4

    return n == 0 ? "Zero" : numToWords(n);
}

document.addEventListener("DOMContentLoaded", () => {

    // 1️⃣ Define your options
    const prefixOptions = [
        { value: "SO", label: "Sabeel Office" },
        { value: "JK", label: "Jamaat Khana" },
        { value: "VP", label: "Vazeehpura Masjid" },
    ];
    
    // 2️⃣ Grab the <select>
    const prefixSelect = document.getElementById("prefix");
    
    // 3️⃣ Add a placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select Receipt Type";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    prefixSelect.appendChild(placeholderOption);
    
    // 4️⃣ Now add the real options
    prefixOptions.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        prefixSelect.appendChild(o);
    });

    // Function to reset form values
    function resetFormFields() {
        // Reset all input fields
        document.querySelectorAll("input").forEach(input => {
            input.value = "";
        });

        prefixSelect.selectedIndex = 0; 
    }

    flatpickr("#birthday", {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        allowInput: true
    });
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#28a745';
        toast.style.color = '#fff';
        toast.style.padding = '15px 30px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        toast.style.fontSize = '1.2rem';
        toast.style.zIndex = '10000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    const form = document.getElementById("user-form");
    const inputs = document.querySelectorAll("input");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        // 1️⃣ Validate prefix selection
        const prefixValue = prefixSelect.value;
        if (!prefixValue) {
            alert("Please select a Receipt Type!");
            prefixSelect.focus();
            return;
        }

        const formData = {};
        inputs.forEach(input => {
            formData[input.id] = input.value.trim();
        });
        formData.prefix = prefixValue;
        // const prefixSelect = document.getElementById("prefix");
        // formData.prefix = prefixSelect.value;

        const amountRaw = formData["amount"] || ""; // fallback to empty string
        const amount = parseInt(amountRaw.replace(/\D/g, ""));
        formData.amountWords = isNaN(amount) ? "" : numberToWordsIN(amount) + " Rupees Only";

        window.electronAPI.saveData(formData);
        resetFormFields();
    });

    window.electronAPI.onExcelUpdated((message) => {
        console.log(message);
        showToast("Data save to file - "+message);
    });
});
