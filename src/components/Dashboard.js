import React, { useState } from 'react';
import * as XLSX from 'xlsx';
// ...existing code...

const Dashboard = () => {
    // ...existing code...
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                // Send the parsed data to the backend
                fetch('/api/upload-emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(worksheet),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div>
            // ...existing code...
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload Emails</button>
            // ...existing code...
        </div>
    );
};

export default Dashboard;
