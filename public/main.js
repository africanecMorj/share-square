
// let code = 53042;
//     axios.get(`http://localhost:3000/download/${code}`, {responseType: 'blob'})
//     .then(async(res) => {
//         const url = window.URL.createObjectURL(new Blob([res.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', `share-square.zip`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
        
        
//     });


$('#upload').click(function () {
  
    let data = {
        files: $('#file')[0].files[0]
    }
    axios.post('http://localhost:3000/upload/false/false', data, 
    { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(res => {
        console.log(res)

        $('#currentCode').text(res.data.code);
    });

    alert('ulpoaded');
});

