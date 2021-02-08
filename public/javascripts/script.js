
const items = document.querySelectorAll('.btn--delete');

items.forEach(item => {
    item.addEventListener('click', function(e){
        e.preventDefault();
        
        const id = this.getAttribute('data-id');
        const url = String(window.location.origin);
        const apiUrl = url + '/posts/' + id;

        console.log(apiUrl);

        fetch(apiUrl, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = '/posts';
        })
        .catch((error) => {
            console.log('Error:', error);
        });
        
    });
})

