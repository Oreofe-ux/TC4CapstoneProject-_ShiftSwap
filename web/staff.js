document.addEventListener("DOMContentLoaded", function ()
{
    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener("input", function () {
        filterTable();
    });

    const qualifiedOnly = document.getElementById('qualifiedOnly');
    const roleSelect = document.getElementById('role');
    const deptSelect = document.getElementById('dept');
    const shiftSelect = document.getElementById('shift');

    qualifiedOnly.addEventListener('change', filterTable);
    roleSelect.addEventListener('change', filterTable);
    deptSelect.addEventListener('change', filterTable);
    shiftSelect.addEventListener('change', filterTable);

    function filterTable() {
        const query = searchInput.value.toLowerCase();
        const selectedStatus = qualifiedOnly.value;
        const selectedRole = roleSelect.value;
        const selectedDept = deptSelect.value;
        const selectedShift = shiftSelect.value;

        const rows = document.querySelectorAll('table tbody tr');

        rows.forEach(row => {
            const staffName = row.querySelector('.name-box').textContent.toLowerCase();
            const staffId = row.querySelector('.staff-id').textContent.toLowerCase();
            const role = row.querySelector('.role').textContent.toLowerCase();
            const dept = row.querySelector('.dept').textContent.toLowerCase();

            let matchesSearch = staffName.includes(query) || staffId.includes(query) || role.includes(query) || dept.includes(query);

            let matchesStatus = selectedStatus === 'all' || row.classList.contains(selectedStatus);

            let matchesRole = selectedRole === 'all' || role.includes(selectedRole.toLowerCase());

            let matchesDept = selectedDept === 'all' || dept.includes(selectedDept.toLowerCase());

            let matchesShift = selectedShift === 'all' || row.querySelector('.shift').textContent.toLowerCase().includes(selectedShift.toLowerCase());

            if (matchesSearch && matchesStatus && matchesRole && matchesDept && matchesShift) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }

        });
    }
});
