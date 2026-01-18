document.addEventListener("DOMContentLoaded", function()
{
    let selectedDuration = null;

    function selectDuration(hours) {
        selectedDuration = hours; 
        alert(`Shift coverage requested for the next ${hours} hours.`);
    }

    document.querySelector('#broadcast-form').addEventListener('submit', async (e) => {
        e.preventDefault(); 
        await sendBroadcast();
    });

    async function sendBroadcast() {
        const message = document.querySelector("textarea").value.trim();

        if (!message) {
            alert("Please enter a broadcast message.");
        return;
        }

        if (!selectDuration) {
            alert("Please enter a shift duration.");
        return;
        }

        const sendSMS = document.querySelectorAll("input[ type='checkbox']") [0].checked;
        const sendEmail = document.querySelectorAll("input[ type='checkbox']") [1].checked;

        const payload = {
            message,
            department: "Emergency",
            coverageHours: selectDuration,
            channels: [`${sendSMS}`, `${sendEmail}`]
        };

        await httpClient.post('/emergency-broadcast/send', payload)
        alert("Emergency broadcast sent successfully.");
    }

    // Attach event listeners to shift buttons
    const shiftButtons = document.querySelectorAll(".shift-btn");

    shiftButtons.forEach(button => {
        button.onclick = () => selectDuration(Number(button.getAttribute("data-value")));
    });

    const primaryButton = document.querySelector(".primary");
    if (primaryButton) {
    primaryButton.onclick = sendBroadcast;
    }
});
