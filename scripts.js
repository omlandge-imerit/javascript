
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const convertBtn = document.getElementById('convertBtn');

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        fileName.textContent = file ? file.name : 'No file chosen';
    });

    convertBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please upload a JSON file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonContent = e.target.result;
            try {
                const jsonObject = JSON.parse(jsonContent);
                const csvContent = convertToCSV(jsonObject);
                downloadCSV(csvContent, file.name.replace('.json', '.csv'));
            } catch (error) {
                alert('Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    });
});

function convertToCSV(jsonObject) {
    const headers = Object.keys(jsonObject[0]);
    const csvRows = [headers.join(',')];

    for (const row of jsonObject) {
        const values = headers.map(header => JSON.stringify(row[header], (key, value) => value || ''));
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}