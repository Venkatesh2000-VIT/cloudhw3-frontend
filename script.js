const apigClient = apigClientFactory.newClient();
document.getElementById('top-button').addEventListener('click', function() {
    const imageContainer = document.getElementById('image-container');
    const dynamicContent = document.getElementById('dynamic-content');
    const inputText = document.getElementById('top-input').value;

    imageContainer.innerHTML = '';
   
    const params = {
        q: inputText
    };
    const body = {};
    const additionalParams = {
        headers: {
        },
        queryParams: {
        }
    };
    apigClient.searchGet(params, body, additionalParams)
    .then(function(result) {   
        console.log(result);
        imageContainer.innerHTML = '';
        imageContainer.classList.add('image-grid');
        result.data.forEach(function(item) {
            const imageUrl = 'https://' + item['bucket'] + 
            '.s3.us-east-1.amazonaws.com/' 
            + item['objectKey']; // Adjust based on your API response structure

            if (imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Dynamic Image';

                imageContainer.appendChild(img);
            } else {
                console.error('Image URL not found in the response');
            }
        });

        dynamicContent.style.display = 'inline-block';
    }).catch(function(error) {
        console.error(error);
    });
});


document.getElementById('bottom-button').addEventListener('click', function () {
    var fileInput = document.getElementById('file-upload');
    var customLabelsInput = document.getElementById('bottom-input');

    if (fileInput.files.length === 0) {
        alert('Please select a file to upload.');
        return;
    }

    var file = fileInput.files[0];
    var customLabels = customLabelsInput.value;

    var params = {
        key: file.name,
        'x-amz-meta-customlabels': customLabels
    };

    var reader = new FileReader();
    reader.onload = function (event) {
        // Ensure binary data is correctly passed
        var body = event.target.result;
        console.log('Body:', body);

        // Construct the URL for the PUT request
        var url = `https://vinnvz2x04.execute-api.us-east-1.amazonaws.com/dev/upload/${encodeURIComponent(params.key)}`;

        // Make the HTTP PUT call using fetch
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type, // Ensure file type matches S3 expectations
                'x-amz-meta-customlabels': customLabels
            },
            body: body
        })
        .then(response => {
            if (response.ok) {
                console.log('File uploaded successfully:', response);
                alert('File uploaded successfully.');
                document.getElementById('file-upload').value = '';
                document.getElementById('bottom-input').value = '';
            } else {
                return response.text().then(text => { throw new Error(text) });
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Error uploading file.');
        });
    };

    // Read the file as an ArrayBuffer (binary data)
    reader.readAsArrayBuffer(file);

    // Debugging logs
    console.log('File type:', fileInput.files[0].type);
    console.log('File name:', fileInput.files[0].name);
    console.log('Custom labels:', customLabelsInput.value);
});


























// document.getElementById('bottom-button').addEventListener('click', function() {
//     var fileInput = document.getElementById('file-upload');
//     var customLabelsInput = document.getElementById('bottom-input');
    
//     if (fileInput.files.length === 0) {
//         alert('Please select a file to upload.');
//         return;
//     }

//     var file = fileInput.files[0];
//     var customLabels = customLabelsInput.value;

//     var params = {
//         key: file.name,
//         'x-amz-meta-customlabels': customLabels
//     };

//     var additionalParams = {
//         headers: {
//             'Content-Type': file.type,
//             'x-amz-meta-customlabels': customLabels
//         }
//     };

//     var reader = new FileReader();
//     reader.onload = function(event) {
//         var body = new Uint8Array(event.target.result);

//         apigClient.uploadKeyPut(params, body, additionalParams)
//             .then(function(result) {
//                 console.log('File uploaded successfully:', result);
//                 alert('File uploaded successfully.');
//             }).catch(function(error) {
//                 console.error('Error uploading file:', error);
//                 alert('Error uploading file.');
//             });
//     };

//     reader.readAsArrayBuffer(file);
//     console.log('File type:', fileInput.files[0].type);
//     console.log('File name:', fileInput.files[0].name);
//     console.log('Custom labels:', customLabelsInput.value);
// });

 // Call the GET method
    // apigClient.searchGet(params, body, additionalParams)
    //     .then(function(result) {
    //         // Log the result to debug
    //         console.log(result);

    //         // Handle the result
    //         const imageUrl = 'https://' + result.data[0]['bucket'] + 
    //         '.s3.us-east-1.amazonaws.com/' 
    //         + result.data[0]['objectKey']; // Adjust based on your API response structure

    //         if (imageUrl) {
    //             // Create and append new image
    //             const img = document.createElement('img');
    //             img.src = imageUrl;
    //             img.alt = 'Dynamic Image';
    //             img.style.maxWidth = '100%'; // Ensure responsive
    //             img.style.height = 'auto';  // Maintain aspect ratio

    //             imageContainer.appendChild(img);

    //             // Show the dynamic content
    //             dynamicContent.style.display = 'block';
    //         } else {
    //             console.error('Image URL not found in the response');
    //         }
    //     }).catch(function(error) {
    //         // Handle the error
    //         console.error(error);
    //     });