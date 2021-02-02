
const items = document.querySelectorAll('.wishlist__btn--delete');

items.forEach(item => {
    item.addEventListener('click', function(){
        const id = this.getAttribute('data-id');
        const url = 'http://localhost:3000/posts/';
        const apiUrl = url + id;

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

