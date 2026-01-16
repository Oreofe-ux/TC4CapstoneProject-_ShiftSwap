document.addEventListener("DOMContentLoaded", function()
{
    let selectedDuration = null;

    function selectDuration(hours) {
    selectedDuration = hours; alert(`Shift coverage requested for the next ${hours} hours.`);
    }

    function sendBroadcast() {
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
            duration: selectDuration,
            channels: {
                sms: sendSMS,
                email: sendEmail
            }
        };

        console.log("Emergency Broadcast Payload:", payload);
        alert("Emergency broadcast sent successfully.");
    }
        const buttons = document.querySelectorAll(".secondary");
        if (buttons.length > 0) {
        buttons[0].onclick = () => selectDuration(4);
        buttons[1].onclick = () => selectDuration(8);
        buttons[2].onclick = () => selectDuration(12);
        }

        const primaryButton = document.querySelector(".primary");
        if (primaryButton) {
        primaryButton.onclick = sendBroadcast;
        }
});