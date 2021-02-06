
const items = document.querySelectorAll('.wishlist__btn--delete');

items.forEach(item => {
    item.addEventListener('click', function(e){
        e.preventDefault();
        
        const id = this.getAttribute('data-id');
        const url = String(window.location.href);
        const apiUrl = url + '/' + id;

        console.log(url);

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

