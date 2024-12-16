document.addEventListener("DOMContentLoaded", () => {
    // Load stored files on page load
    loadStoredFiles();

    // Add event listener to the upload button
    document.getElementById("uploadButton").addEventListener("click", uploadFile);
});

// Upload a file to IPFS and save its metadata locally
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        // Upload file to IPFS
        const response = await fetch("http://127.0.0.1:5001/api/v0/add", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        const ipfsHash = data.Hash;

        // Store file metadata locally
        storeMetadata(file.name, ipfsHash);

        // Add the file to the UI list
        addFileToList(file.name, ipfsHash);

        alert("File uploaded successfully!");
    } catch (error) {
        console.error("Error uploading file to IPFS:", error);
        alert("Failed to upload file to IPFS.");
    }
}

// Store file metadata in local storage
function storeMetadata(fileName, ipfsHash) {
    const metadata = JSON.parse(localStorage.getItem("fileMetadata")) || [];
    metadata.push({ fileName, ipfsHash });
    localStorage.setItem("fileMetadata", JSON.stringify(metadata));
}

// Load stored files from local storage and display them
function loadStoredFiles() {
    const metadata = JSON.parse(localStorage.getItem("fileMetadata")) || [];
    metadata.forEach((file) => addFileToList(file.fileName, file.ipfsHash));
}

// Add a file to the file list UI
function addFileToList(fileName, ipfsHash) {
    const fileList = document.getElementById("fileList");

    // Create list item
    const li = document.createElement("li");
    li.textContent = '${fileName} (${ipfsHash})';

    // Create download button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", () => downloadFile(ipfsHash));

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteFile(fileName, ipfsHash));

    // Append buttons to the list item
    li.appendChild(downloadButton);
    li.appendChild(deleteButton);

    // Append the list item to the file list
    fileList.appendChild(li);
}

// Download a file from IPFS using its hash
async function downloadFile(ipfsHash) {
    try {
        const response = await fetch("http://127.0.0.1:8080/ipfs/${ipfsHash}");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded-file"; // You can customize the filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download file.");
    }
}

// Delete a file's metadata from local storage
function deleteFile(fileName, ipfsHash) {
    const metadata = JSON.parse(localStorage.getItem("fileMetadata")) || [];
    const updatedMetadata = metadata.filter((file) => file.ipfsHash !== ipfsHash);
    localStorage.setItem("fileMetadata", JSON.stringify(updatedMetadata));

    // Reload the file list
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    loadStoredFiles();

    alert('File "${fileName}" deleted successfully.');
}