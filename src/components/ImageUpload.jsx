import React from 'react';

const ImageUpload = ({ onImageUpload }) => {
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            onImageUpload(url);
        }
    };

    return (
        <div className="upload-container" style={{ margin: '10px' }}>
            <label
                htmlFor="file-upload"
                className="custom-file-upload"
                style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    transition: 'background 0.3s'
                }}
            >
                Escolher Foto
            </label>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ImageUpload;
