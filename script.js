document.addEventListener('DOMContentLoaded', () => {
    const patientForm = document.getElementById('patientForm');
    const patientList = document.getElementById('patientList');
    const filterName = document.getElementById('filterName');

    patientForm.addEventListener('submit', handleFormSubmit);
    filterName.addEventListener('input', renderPatientList);

    let editIndex = null;

    function getPatients() {
        return JSON.parse(localStorage.getItem('patients')) || [];
    }

    function savePatients(patients) {
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const birthDate = document.getElementById('birthDate').value;
        const cpf = document.getElementById('cpf').value.trim();
        const sex = document.getElementById('sex').value;
        const address = document.getElementById('address').value.trim();
        const status = document.getElementById('status').value;

        if (editIndex !== null) {
            updatePatient(editIndex, { name, birthDate, cpf, sex, address, status });
        } else {
            addPatient({ name, birthDate, cpf, sex, address, status });
        }

        resetForm();
        renderPatientList();
    }

    function addPatient(patient) {
        const patients = getPatients();
        if (patients.some(p => p.cpf === patient.cpf)) {
            alert('CPF duplicado!');
            return;
        }
        patients.push(patient);
        savePatients(patients);
    }

    function updatePatient(index, updatedPatient) {
        const patients = getPatients();
        patients[index] = updatedPatient;
        savePatients(patients);
        editIndex = null;
    }

    function editPatient(index) {
        const patients = getPatients();
        const patient = patients[index];

        document.getElementById('name').value = patient.name;
        document.getElementById('birthDate').value = patient.birthDate;
        document.getElementById('cpf').value = patient.cpf;
        document.getElementById('sex').value = patient.sex;
        document.getElementById('address').value = patient.address;
        document.getElementById('status').value = patient.status;

        editIndex = index;
    }

    function deletePatient(index) {
        const patients = getPatients();
        patients.splice(index, 1);
        savePatients(patients);
        renderPatientList();
    }

    function renderPatientList() {
        const patients = getPatients();
        const filter = filterName.value.toLowerCase();
        patientList.innerHTML = '';

        patients.filter(patient => patient.name.toLowerCase().includes(filter)).forEach((patient, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${patient.name}</td>
                <td>${patient.birthDate}</td>
                <td>${patient.cpf}</td>
                <td>${patient.sex}</td>
                <td>${patient.address}</td>
                <td>${patient.status}</td>
                <td>
                    <button onclick="editPatient(${index})">Editar</button>
                    <button onclick="deletePatient(${index})">Inativar</button>
                </td>
            `;

            patientList.appendChild(row);
        });
    }

    function resetForm() {
        patientForm.reset();
        editIndex = null;
    }

    renderPatientList();

    // Exposing functions to global scope for access from HTML
    window.editPatient = editPatient;
    window.deletePatient = deletePatient;
});
