// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedFileStorage {
    
    // Struct to hold file details
    struct File {
        string ipfsHash;  // IPFS hash (CID)
        string fileName;  // Name of the file
        uint256 fileSize; // Size of the file in bytes
        uint256 uploadTime; // Timestamp when the file was uploaded
        address uploader; // Address of the uploader
    }

    // Mapping from IPFS hash to file details
    mapping(string => File) public files;

    // Event for when a file is added
    event FileAdded(
        string ipfsHash,
        string fileName,
        uint256 fileSize,
        uint256 uploadTime,
        address indexed uploader
    );

    // Function to add a file
    function addFile(string memory _ipfsHash, string memory _fileName, uint256 _fileSize) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash is required");
        require(bytes(_fileName).length > 0, "File name is required");
        require(_fileSize > 0, "File size must be greater than 0");

        // Check if the file already exists
        require(files[_ipfsHash].uploader == address(0), "File already exists");

        // Add file details to the mapping
        files[_ipfsHash] = File({
            ipfsHash: _ipfsHash,
            fileName: _fileName,
            fileSize: _fileSize,
            uploadTime: block.timestamp,
            uploader: msg.sender
        });

        // Emit an event when a file is added
        emit FileAdded(_ipfsHash, _fileName, _fileSize, block.timestamp, msg.sender);
    }

    // Function to retrieve file details by IPFS hash
    function getFile(string memory _ipfsHash) public view returns (
        string memory ipfsHash,
        string memory fileName,
        uint256 fileSize,
        uint256 uploadTime,
        address uploader
    ) {
        File memory file = files[_ipfsHash];
        require(file.uploader != address(0), "File not found");

        return (
            file.ipfsHash,
            file.fileName,
            file.fileSize,
            file.uploadTime,
            file.uploader
        );
    }
}
